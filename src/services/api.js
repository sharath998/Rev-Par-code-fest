import { hotels, getHotelById, searchHotels, getFeaturedHotels } from '../data/hotels';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hotelService = {
  async getAll() {
    await delay(300);
    return { data: hotels, success: true };
  },

  async getById(id) {
    await delay(200);
    const hotel = getHotelById(id);
    if (!hotel) {
      return { data: null, success: false, error: 'Hotel not found' };
    }
    return { data: hotel, success: true };
  },

  async getFeatured() {
    await delay(250);
    return { data: getFeaturedHotels(), success: true };
  },

  async search(filters) {
    await delay(400);
    const results = searchHotels(filters);
    return { data: results, success: true, total: results.length };
  }
};

export const bookingService = {
  async create(bookingData) {
    await delay(500);
    const booking = {
      ...bookingData,
      id: `BK${Date.now()}`,
      status: 'Booked',
      createdAt: new Date().toISOString()
    };
    return { data: booking, success: true };
  },

  async cancel(bookingId) {
    await delay(300);
    return { data: { id: bookingId, status: 'Cancelled' }, success: true };
  },

  async getByUser(userId) {
    await delay(300);
    return { data: [], success: true };
  }
};
