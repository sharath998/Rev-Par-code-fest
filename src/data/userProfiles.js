// ═══════════════════════════════════════════════════════════════════════════
// User Profiles — extends the base user data with the features the ranker
// needs:  home geo  ·  preferences  ·  recent search history.
//
// Kept separate from data/users.js on purpose so that any accidental revert
// of users.js does not also wipe out these profiles. Keyed by user id.
//
// Search history uses relative offsets (hours/days ago) so the demo is always
// "fresh" no matter when the file is loaded; we materialize timestamps at
// access time via getUserProfile().
// ═══════════════════════════════════════════════════════════════════════════

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

/**
 * Coarse geo + preferences + a list of mock recent searches.
 *
 *   search.hotelId   : the hotel they viewed (matches data/hotels.js)
 *   search.location  : free-text city, for matches when hotelId differs
 *   search.hoursAgo  : how long ago they searched (relative to "now")
 */
const RAW_PROFILES = {
  // Sarah Mitchell — New York based, business traveler, frequent NY/Chicago
  1: {
    homeCity: 'New York, NY',
    geo: { lat: 40.7128, lon: -74.0060 },
    timezone: 'America/New_York',
    preferences: {
      priceMin: 400,
      priceMax: 1500,
      propertyTypes: ['city', 'business'],
      preferredCities: ['New York, NY', 'Chicago, IL', 'San Francisco, CA'],
      amenities: ['Business Center', 'Fitness Center', 'Concierge'],
    },
    searches: [
      { hotelId: 1, location: 'New York, NY',   hoursAgo: 3 },
      { hotelId: 4, location: 'Chicago, IL',    hoursAgo: 26 },
      { hotelId: 1, location: 'New York, NY',   hoursAgo: 38 },
      { hotelId: 3, location: 'Beverly Hills, CA', hoursAgo: 96 },
      { hotelId: 4, location: 'Chicago, IL',    hoursAgo: 140 },
    ],
  },

  // James Rodriguez — Los Angeles, beach + leisure
  2: {
    homeCity: 'Los Angeles, CA',
    geo: { lat: 34.0522, lon: -118.2437 },
    timezone: 'America/Los_Angeles',
    preferences: {
      priceMin: 600,
      priceMax: 2200,
      propertyTypes: ['beach', 'resort'],
      preferredCities: ['Wailea, HI', 'Laguna Beach, CA', 'Maui, HI'],
      amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports'],
    },
    searches: [
      { hotelId: 2, location: 'Wailea, HI',      hoursAgo: 5 },
      { hotelId: 5, location: 'Laguna Beach, CA', hoursAgo: 20 },
      { hotelId: 2, location: 'Wailea, HI',      hoursAgo: 70 },
      { hotelId: 5, location: 'Laguna Beach, CA', hoursAgo: 110 },
    ],
  },

  // Emma Chen — San Francisco, international platinum traveler
  3: {
    homeCity: 'San Francisco, CA',
    geo: { lat: 37.7749, lon: -122.4194 },
    timezone: 'America/Los_Angeles',
    preferences: {
      priceMin: 800,
      priceMax: 4500,
      propertyTypes: ['international', 'luxury'],
      preferredCities: ['Tokyo, Japan', 'Portofino, Italy', 'New York, NY'],
      amenities: ['Spa', 'Fine Dining', 'Butler Service', 'Private Garden'],
    },
    searches: [
      { hotelId: 7, location: 'Tokyo, Japan',     hoursAgo: 2 },
      { hotelId: 8, location: 'Portofino, Italy', hoursAgo: 18 },
      { hotelId: 1, location: 'New York, NY',     hoursAgo: 45 },
      { hotelId: 7, location: 'Tokyo, Japan',     hoursAgo: 90 },
      { hotelId: 8, location: 'Portofino, Italy', hoursAgo: 130 },
    ],
  },

  // Michael Thompson — Denver, ski / mountain enthusiast
  4: {
    homeCity: 'Denver, CO',
    geo: { lat: 39.7392, lon: -104.9903 },
    timezone: 'America/Denver',
    preferences: {
      priceMin: 500,
      priceMax: 2000,
      propertyTypes: ['mountain', 'resort'],
      preferredCities: ['Aspen, CO', 'Park City, UT', 'Jackson, WY'],
      amenities: ['Fireplace', 'Mountain View', 'Ski Access', 'Spa'],
    },
    searches: [
      { hotelId: 6, location: 'Aspen, CO', hoursAgo: 8 },
      { hotelId: 6, location: 'Aspen, CO', hoursAgo: 30 },
      { hotelId: 6, location: 'Aspen, CO', hoursAgo: 72 },
      { hotelId: 6, location: 'Aspen, CO', hoursAgo: 150 },
    ],
  },

  // Olivia Martinez — Los Angeles, luxury domestic
  5: {
    homeCity: 'Los Angeles, CA',
    geo: { lat: 34.0522, lon: -118.2437 },
    timezone: 'America/Los_Angeles',
    preferences: {
      priceMin: 700,
      priceMax: 3500,
      propertyTypes: ['city', 'luxury', 'beach'],
      preferredCities: ['Beverly Hills, CA', 'Laguna Beach, CA', 'New York, NY'],
      amenities: ['Spa', 'Fine Dining', 'Pool', 'Concierge'],
    },
    searches: [
      { hotelId: 3, location: 'Beverly Hills, CA', hoursAgo: 4 },
      { hotelId: 5, location: 'Laguna Beach, CA',  hoursAgo: 22 },
      { hotelId: 3, location: 'Beverly Hills, CA', hoursAgo: 60 },
      { hotelId: 1, location: 'New York, NY',      hoursAgo: 100 },
      { hotelId: 5, location: 'Laguna Beach, CA',  hoursAgo: 160 },
    ],
  },
};

/**
 * Materialize search timestamps relative to "now" (or a custom reference).
 * Returns a profile with absolute Date-millis timestamps in `searches`.
 */
export function getUserProfile(userId, now = Date.now()) {
  const raw = RAW_PROFILES[userId];
  if (!raw) return null;
  return {
    ...raw,
    searches: raw.searches.map((s) => ({
      hotelId: s.hotelId,
      location: s.location,
      timestamp: now - s.hoursAgo * HOUR,
      hoursAgo: s.hoursAgo,
    })),
  };
}

export function getAllUserProfiles(now = Date.now()) {
  return Object.keys(RAW_PROFILES).map((id) => ({
    userId: Number(id),
    ...getUserProfile(Number(id), now),
  }));
}

export const TIME_WINDOWS = { HOUR, DAY };

export default getUserProfile;
