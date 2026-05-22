// ═══════════════════════════════════════════════════════════════════════════
// Hotel geo + timezone — keyed by hotel id from data/hotels.js
// (kept in a separate file so accidental reverts of hotels.js don't lose it)
// ═══════════════════════════════════════════════════════════════════════════

const HOTEL_GEO = {
  1: { lat: 40.7666, lon: -73.9763, tz: 'America/New_York'   }, // Ritz-Carlton NY
  2: { lat: 20.6912, lon: -156.4435, tz: 'Pacific/Honolulu'  }, // Four Seasons Maui (Wailea)
  3: { lat: 34.0697, lon: -118.4226, tz: 'America/Los_Angeles' }, // Peninsula Beverly Hills
  4: { lat: 41.8997, lon: -87.6248, tz: 'America/Chicago'    }, // Waldorf Chicago
  5: { lat: 33.5436, lon: -117.7836, tz: 'America/Los_Angeles' }, // Laguna Beach
  6: { lat: 39.1911, lon: -106.8175, tz: 'America/Denver'    }, // Aspen
  7: { lat: 35.6856, lon: 139.7670, tz: 'Asia/Tokyo'         }, // Aman Tokyo
  8: { lat: 44.3035, lon: 9.2106,   tz: 'Europe/Rome'        }, // Portofino
  9: { lat: 25.7617, lon: -80.1918, tz: 'America/New_York'   }, // Miami fallback
  10: { lat: 51.5074, lon: -0.1278,  tz: 'Europe/London'      }, // London fallback
};

export function getHotelGeo(hotelId) {
  return HOTEL_GEO[hotelId] || null;
}

export default HOTEL_GEO;
