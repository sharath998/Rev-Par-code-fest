// Service layer — swap delay+mock with real fetch() calls when backend is ready.

import {
  cancelledReservations,
  getReservationById,
} from '../data/lastMinuteOffers';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const OFFERS_STORAGE_KEY = 'revpar_last_minute_offers';

// Merge static mock data + dynamic localStorage offers
const getAllOffers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(OFFERS_STORAGE_KEY) || '[]');
    // Combine: localStorage first (most recent), then static mocks
    return [...stored, ...cancelledReservations];
  } catch {
    return cancelledReservations;
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
