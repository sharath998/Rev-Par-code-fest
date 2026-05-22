import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getUserByCredentials, getUsersExcept } from '../data/users';
import appConfig from '../config/appConfig';
import {
  connectSocket,
  disconnectSocket,
  emitCancellation,
  onOfferEvents,
} from '../services/socketService';
import { notify, ensurePermission } from '../services/notificationService';
import { rankUsersForOffer } from '../services/ranker';

const AppContext = createContext();

const STORAGE_KEYS = {
  CURRENT_USER: 'revpar_current_user',
  BOOKINGS: 'revpar_bookings',
  OFFERS: 'revpar_offers',
};

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

const isOfferExpired = (offer) => {
  if (!offer || !offer.expiresAt) return true;
  return new Date(offer.expiresAt) <= new Date();
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// ═══════════════════════════════════════════════════════════════════════════
// Provider Component
// ═══════════════════════════════════════════════════════════════════════════

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(STORAGE_KEYS.CURRENT_USER));
  const [bookings, setBookings] = useState(() => loadFromStorage(STORAGE_KEYS.BOOKINGS, []));
  const [offers, setOffers] = useState(() => loadFromStorage(STORAGE_KEYS.OFFERS, []));

  // Persist to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OFFERS, offers);
  }, [offers]);

  // ─────────────────────────────────────────────────────────────────────────
  // Realtime: connect to Socket.IO when logged in, receive offers from
  // other users' cancellations and fire a branded notification.
  // ─────────────────────────────────────────────────────────────────────────

  const currentUserRef = useRef(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      disconnectSocket();
      return undefined;
    }

    connectSocket(currentUser.id);
    ensurePermission();

    const mergeIncomingOffer = (offer) => {
      if (!offer || !offer.id) return false;
      const me = currentUserRef.current;
      if (!me) return false;
      const targets = Array.isArray(offer.notifiedUserIds) ? offer.notifiedUserIds : [];
      if (!targets.map(String).includes(String(me.id))) return false;

      let isNew = false;
      setOffers((prev) => {
        if (prev.some((o) => o.id === offer.id)) return prev;
        isNew = true;
        return [...prev, offer];
      });
      return isNew;
    };

    const unsubscribe = onOfferEvents(
      (offer) => {
        const isNew = mergeIncomingOffer(offer);
        if (isNew) {
          notify({
            title: 'Last-minute deal!',
            body: `${offer.discountPercent}% off at ${offer.hotelName} — book before it expires`,
            data: { offerId: offer.id, hotelId: offer.hotelId, offer },
          });
        }
      },
      (list) => {
        if (!Array.isArray(list)) return;
        list.forEach((o) => mergeIncomingOffer(o));
      }
    );

    return () => {
      try {
        unsubscribe && unsubscribe();
      } catch (_) {
        /* ignore */
      }
    };
  }, [currentUser]);

  // ─────────────────────────────────────────────────────────────────────────
  // Auth Actions
  // ─────────────────────────────────────────────────────────────────────────
  
  const login = (username, password) => {
    const u = String(username || '').trim().toLowerCase();
    const p = String(password || '');

    // Hardcoded admin account (demo only — replace with a real backend role)
    if (u === 'admin' && p === 'admin') {
      const adminUser = {
        id: 0,
        name: 'Admin',
        username: 'admin',
        email: 'admin@revpar.com',
        tier: 'Admin',
        loyaltyPoints: 0,
        isAdmin: true,
      };
      setCurrentUser(adminUser);
      return { success: true, isAdmin: true };
    }

    const user = getUserByCredentials(username, password);
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    setCurrentUser(sanitizeUser(user));
    return { success: true, isAdmin: false };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Booking Actions
  // ─────────────────────────────────────────────────────────────────────────

  const getUserBookings = (userId) => {
    return bookings.filter((b) => b.userId === userId && b.status === 'active');
  };

  const canUserBook = (userId) => {
    const userBookings = getUserBookings(userId);
    return userBookings.length < appConfig.maxBookingsPerUser;
  };

  const addBooking = (bookingData) => {
    if (!canUserBook(bookingData.userId)) {
      return { success: false, error: 'Maximum active bookings reached' };
    }

    const newBooking = {
      id: `BK${Date.now()}`,
      ...bookingData,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);
    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };
    const cancelledAt = new Date().toISOString();

    // Calculate cancellation fee
    const fee = booking.room.price * appConfig.cancellationFeeDays;

    // Mark booking as cancelled
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', cancelledAt, cancellationFee: fee }
          : b
      )
    );

    // Generate offer for other users
    const baseOffer = generateOffer({ ...booking, cancelledAt });

    // ── AI matching ─────────────────────────────────────────────────────
    // Rank every eligible (non-canceller) user by how well they match this
    // specific offer right now, then keep only the top-K as the people we
    // actually notify. Stash the full ranking on the offer so the admin
    // dashboard can show the breakdown.
    const allCandidates = baseOffer.notifiedUserIds;
    const ranking = rankUsersForOffer(allCandidates, baseOffer);
    const topK = appConfig.topK || 2;
    const winners = ranking.slice(0, topK).map((r) => r.userId);
    const offer = {
      ...baseOffer,
      notifiedUserIds: winners,        // who actually gets the push
      candidateUserIds: allCandidates, // the original pool (for admin)
      ranking,                         // full sorted breakdown
    };

    setOffers((prev) => [...prev, offer]);

    // Fan out to top-K users via Socket.IO (no-op if backend offline)
    try {
      emitCancellation(offer, booking.userId);
    } catch (e) {
      console.warn('emitCancellation failed:', e);
    }

    return { success: true, fee, offer };
  };

  const generateOffer = (cancelledBooking) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + appConfig.offerValiditySeconds * 1000);

    const discountedPrice = Math.round(
      cancelledBooking.room.price * (1 - appConfig.lastMinuteDiscountPercent / 100)
    );

    const notifiedUsers = getUsersExcept(cancelledBooking.userId).map((u) => u.id);

    return {
      id: `OFF${Date.now()}`,
      hotelId: cancelledBooking.hotel.id,
      hotelName: cancelledBooking.hotel.name,
      hotelImage: cancelledBooking.hotel.thumbnail,
      hotelLocation: cancelledBooking.hotel.location,
      roomType: cancelledBooking.room.type,
      originalPrice: cancelledBooking.room.price,
      discountedPrice,
      discountPercent: appConfig.lastMinuteDiscountPercent,
      checkIn: cancelledBooking.checkIn,
      checkOut: cancelledBooking.checkOut,
      guests: cancelledBooking.guests,
      cancelledAt: cancelledBooking.cancelledAt,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      notifiedUserIds: notifiedUsers,
      status: 'active',
    };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Offer Actions
  // ─────────────────────────────────────────────────────────────────────────

  const getActiveOffersForUser = (userId) => {
    return offers
      .filter(
        (offer) =>
          offer.notifiedUserIds.includes(userId) &&
          offer.status === 'active' &&
          !isOfferExpired(offer) &&
          !offer.dismissedBy?.includes(userId)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAllActiveOffers = () => {
    return offers
      .filter((offer) => offer.status === 'active' && !isOfferExpired(offer))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const dismissOffer = (offerId, userId) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? { ...o, dismissedBy: [...(o.dismissedBy || []), userId] }
          : o
      )
    );
  };

  const bookOffer = (offerId, userId) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return { success: false, error: 'Offer not found' };

    if (!canUserBook(userId)) {
      return { success: false, error: 'Maximum active bookings reached' };
    }

    // Create booking from offer
    const result = addBooking({
      userId,
      hotel: {
        id: offer.hotelId,
        name: offer.hotelName,
        location: offer.hotelLocation,
        thumbnail: offer.hotelImage,
      },
      room: {
        type: offer.roomType,
        price: offer.discountedPrice, // Use discounted price
      },
      checkIn: offer.checkIn,
      checkOut: offer.checkOut,
      guests: offer.guests,
      guestDetails: {
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
      },
      isOfferBooking: true,
      offerId: offer.id,
    });

    if (result.success) {
      // Mark offer as claimed
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, status: 'claimed', claimedBy: userId, claimedAt: new Date().toISOString() }
            : o
        )
      );
    }

    return result;
  };

  const claimOffer = (offerId, userId) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: 'claimed', claimedBy: userId, claimedAt: new Date().toISOString() } : o
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Context Value
  // ─────────────────────────────────────────────────────────────────────────

  const value = {
    // Auth
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: !!(currentUser && currentUser.isAdmin),
    login,
    logout,

    // Bookings
    bookings,
    getUserBookings,
    canUserBook,
    addBooking,
    cancelBooking,

    // Offers
    offers,
    getActiveOffersForUser,
    getAllActiveOffers,
    dismissOffer,
    bookOffer,
    claimOffer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
