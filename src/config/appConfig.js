// ═══════════════════════════════════════════════════════════════════════════
// App Configuration
// ═══════════════════════════════════════════════════════════════════════════

export const appConfig = {
  // Cancellation fee = 1 day's room charge (configurable)
  cancellationFeeDays: 1,
  
  // Offer validity duration (1 hour = 3600 seconds)
  offerValiditySeconds: 3600,
  
  // Discount percentage for last-minute offers (configurable)
  lastMinuteDiscountPercent: 30,
  
  // Maximum active bookings per user
  maxBookingsPerUser: 1,
  
  // App colors
  colors: {
    background: '#F8F6F2',
    dark: '#2C2C2C',
    gold: '#CBA135',
  },

  // Realtime backend (Socket.IO). Override at build time via REACT_APP_SOCKET_URL.
  //   Local dev:         REACT_APP_SOCKET_URL=http://localhost:4000 npm start
  //   Android emulator:  REACT_APP_SOCKET_URL=http://10.0.2.2:4000  npm run build
  //   Same-origin prod:  leave UNSET when running `npm run build` and let the
  //                      Node server serve both the SPA and Socket.IO together.
  //                      An empty string makes socket.io-client default to
  //                      `window.location.origin`, which is what we want for a
  //                      single-EC2-box deployment with an Elastic IP.
  //
  // NOTE: CRA only inlines exact `process.env.REACT_APP_*` accessors at build
  // time; do NOT wrap in `typeof process !== 'undefined'` or substitution
  // breaks silently and you'll get `undefined`.
  socketUrl: process.env.REACT_APP_SOCKET_URL || '',

  // ─── AI matching: when a booking is cancelled, only notify the top-K most
  //     relevant users instead of broadcasting to everyone. ────────────────
  topK: 2,
  rankerWeights: {
    // Top-level blend (should roughly sum to 1)
    W_recency:   0.30,
    W_geo:       0.20,
    W_pref:      0.20,
    W_affinity:  0.20,
    W_localTime: 0.10,

    // Inside the recency sub-score
    recencySubWeights: { r24: 0.50, r2d: 0.30, r7d: 0.20 },

    // Inside the preferences sub-score
    preferenceSubWeights: { city: 0.5, price: 0.3, amenities: 0.2 },

    // Geo: distance at which geo score = 0.5
    geoHalfDistanceKm: 1500,
  },
};

export default appConfig;
