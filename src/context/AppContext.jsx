import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById, getUsersExcept } from '../data/users';
import appConfig from '../config/appConfig';

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
  // Auth Actions
  // ─────────────────────────────────────────────────────────────────────────
  
  const login = (userId) => {
    const user = getUserById(userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
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

    // Calculate cancellation fee
    const fee = booking.room.price * appConfig.cancellationFeeDays;

    // Mark booking as cancelled
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString(), cancellationFee: fee }
          : b
      )
    );

    // Generate offer for other users
    const offer = generateOffer(booking);
    setOffers((prev) => [...prev, offer]);

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
    return offers.filter(
      (offer) =>
        offer.notifiedUserIds.includes(userId) &&
        offer.status === 'active' &&
        !isOfferExpired(offer) &&
        !offer.dismissedBy?.includes(userId)
    );
  };

  const getAllActiveOffers = () => {
    return offers.filter((offer) => offer.status === 'active' && !isOfferExpired(offer));
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
