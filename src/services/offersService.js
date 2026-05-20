// Service layer — swap delay+mock with real fetch() calls when backend is ready.

import {
  cancelledReservations,
  getReservationById,
} from '../data/lastMinuteOffers';
import { users } from '../data/users';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const OFFERS_STORAGE_KEY = 'revpar_offers'; // Use same key as AppContext
const BOOKINGS_STORAGE_KEY = 'revpar_bookings'; // To get cancellation details

// Get user by ID
const getUserById = (id) => users.find(u => u.id === parseInt(id));

// Convert AppContext offer format to admin display format
const convertOfferToReservation = (offer, cancelledBooking) => {
  const now = new Date();
  const expiresAt = new Date(offer.expiresAt);
  const isExpired = expiresAt <= now;
  const cancelledAt = cancelledBooking?.cancelledAt || offer.cancelledAt || offer.createdAt;
  
  let status = 'Active';
  if (offer.status === 'claimed') status = 'Claimed';
  else if (isExpired) status = 'Expired';
  
  return {
    id: offer.id,
    hotelName: offer.hotelName,
    guestName: cancelledBooking?.guestDetails?.name || 'Guest',
    checkInDate: offer.checkIn,
    cancelledAt,
    roomType: offer.roomType,
    offer: {
      id: offer.id,
      hotelName: offer.hotelName,
      hotelImage: offer.hotelImage,
      location: offer.hotelLocation,
      roomType: offer.roomType,
      originalPrice: offer.originalPrice,
      discountedPrice: offer.discountedPrice,
      discountPercent: offer.discountPercent,
      checkIn: offer.checkIn,
      checkOut: offer.checkOut,
      guests: offer.guests,
      createdAt: offer.createdAt,
      expiresAt: offer.expiresAt,
      status,
      notifications: offer.notifiedUserIds?.map((userId) => {
        const user = getUserById(userId);
        return {
          userId,
          userName: user?.name || `User ${userId}`,
          email: user?.email || `user${userId}@revpar.com`,
          sentAt: offer.createdAt,
          status: offer.dismissedBy?.includes(userId) ? 'Dismissed' : 
                  offer.claimedBy === userId ? 'Clicked' : 'Sent',
        };
      }) || [],
    },
  };
};

// Get all offers from AppContext storage
const getAllOffers = () => {
  try {
    const offers = JSON.parse(localStorage.getItem(OFFERS_STORAGE_KEY) || '[]');
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
    
    // Convert offers to admin format
    const converted = offers.map(offer => {
      const cancelledBooking = bookings.find(b => 
        b.status === 'cancelled' && 
        b.hotel?.id === offer.hotelId &&
        b.checkIn === offer.checkIn &&
        b.checkOut === offer.checkOut &&
        b.room?.type === offer.roomType
      );
      return convertOfferToReservation(offer, cancelledBooking);
    });
    
    // Combine with static mock data
    return [...converted, ...cancelledReservations].sort(
      (a, b) => new Date(b.cancelledAt).getTime() - new Date(a.cancelledAt).getTime()
    );
  } catch {
    return [...cancelledReservations].sort(
      (a, b) => new Date(b.cancelledAt).getTime() - new Date(a.cancelledAt).getTime()
    );
  }
};

export const offersService = {
  /** GET /admin/offers/reservations */
  async getAll(filters = {}) {
    await delay(300);
    let data = getAllOffers();

    if (filters.hotel)  data = data.filter(r => r.hotelName === filters.hotel);
    if (filters.status) data = data.filter(r => r.offer.status === filters.status);
    if (filters.date)   data = data.filter(r =>
      new Date(r.checkInDate).toDateString() === new Date(filters.date).toDateString()
    );

    return { success: true, data, total: data.length };
  },

  /** GET /admin/offers/reservations/:id */
  async getById(id) {
    await delay(150);
    const all = getAllOffers();
    const item = all.find(r => r.id === id) || getReservationById(id);
    return item
      ? { success: true, data: item }
      : { success: false, error: 'Not found' };
  },

  /** GET /admin/offers/stats */
  async getStats() {
    await delay(200);
    const all = getAllOffers();
    return {
      success: true,
      data: {
        total:    all.length,
        active:   all.filter(r => r.offer.status === 'Active').length,
        claimed:  all.filter(r => r.offer.status === 'Claimed').length,
        expired:  all.filter(r => r.offer.status === 'Expired').length,
        totalNotified: all.reduce((s, r) => s + r.offer.notifications.length, 0),
      },
    };
  },
};
