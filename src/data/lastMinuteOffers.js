// ─── Last-Minute Offers — Mock Data ─────────────────────────────────────────
// All timestamps are generated relative to "now" so the live countdown works.
// Replace the helper functions with real API calls in src/services/api.js later.

const now = () => new Date();

const minsAgo  = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();
const hrsAgo   = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const hrsFrom  = (base, h) => new Date(new Date(base).getTime() + h * 60 * 60 * 1000).toISOString();
const addDays  = (base, d) => new Date(new Date(base).getTime() + d * 24 * 60 * 60 * 1000).toISOString();

// ── Offer valid for exactly 1 hr from createdAt ───────────────────────────────
const offerExpiry = (createdAt) => hrsFrom(createdAt, 1);

// ── Notifications for each offer ──────────────────────────────────────────────
const makeNotifications = (offerCreatedAt, statuses) =>
  statuses.map(({ name, email, status }, i) => ({
    id:           `N${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    userName:     name,
    email,
    notifiedAt:   new Date(new Date(offerCreatedAt).getTime() + (i + 1) * 45 * 1000).toISOString(),
    status,       // 'Sent' | 'Seen' | 'Clicked'
  }));

// ── Active offer (created 18 min ago → still counting down) ──────────────────
const activeCreatedAt   = minsAgo(18);
// ── Near-expiry offer (created 52 min ago → ~8 min left) ─────────────────────
const nearExpiryCreatedAt = minsAgo(52);
// ── Expired offer (created 2 hrs ago) ────────────────────────────────────────
const expired1CreatedAt = hrsAgo(2);
const expired2CreatedAt = hrsAgo(5);
// ── Claimed offer (created 30 min ago) ────────────────────────────────────────
const claimed1CreatedAt = minsAgo(30);

export const cancelledReservations = [
  // 1 ─ ACTIVE
  {
    id:            'RES-4821',
    hotelName:     'The Ritz-Carlton New York',
    hotelId:       1,
    guestName:     'James Whitfield',
    guestEmail:    'james.w@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),   // today
    cancelledAt:   minsAgo(19),
    roomType:      'Park View Suite',
    originalPrice: 1295,
    offer: {
      id:             'OFF-1001',
      discountPct:    35,
      discountedPrice: 842,
      createdAt:      activeCreatedAt,
      expiresAt:      offerExpiry(activeCreatedAt),
      status:         'Active',
      notifications:  makeNotifications(activeCreatedAt, [
        { name: 'Lena Hoffmann',    email: 'lena.h@example.com',    status: 'Clicked' },
        { name: 'Marcus Reid',      email: 'm.reid@example.com',     status: 'Seen'    },
        { name: 'Sophie Tan',       email: 'sophie.t@example.com',   status: 'Seen'    },
        { name: 'Omar Al-Farsi',    email: 'omar.af@example.com',    status: 'Sent'    },
        { name: 'Priya Nair',       email: 'priya.n@example.com',    status: 'Sent'    },
      ]),
    },
  },

  // 2 ─ NEAR EXPIRY (still Active, countdown nearly 0)
  {
    id:            'RES-3374',
    hotelName:     'Four Seasons Resort Maui',
    hotelId:       2,
    guestName:     'Catherine Moreau',
    guestEmail:    'c.moreau@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),
    cancelledAt:   minsAgo(53),
    roomType:      'Ocean View Suite',
    originalPrice: 1800,
    offer: {
      id:             'OFF-1002',
      discountPct:    40,
      discountedPrice: 1080,
      createdAt:      nearExpiryCreatedAt,
      expiresAt:      offerExpiry(nearExpiryCreatedAt),
      status:         'Active',
      notifications:  makeNotifications(nearExpiryCreatedAt, [
        { name: 'David Kim',        email: 'd.kim@example.com',      status: 'Clicked' },
        { name: 'Yuki Tanaka',      email: 'yuki.t@example.com',     status: 'Clicked' },
        { name: 'Fatima Hassan',    email: 'fatima.h@example.com',   status: 'Seen'    },
        { name: 'Carlos Rivera',    email: 'c.rivera@example.com',   status: 'Sent'    },
      ]),
    },
  },

  // 3 ─ CLAIMED
  {
    id:            'RES-5590',
    hotelName:     'The Peninsula Beverly Hills',
    hotelId:       3,
    guestName:     'Alejandro Reyes',
    guestEmail:    'a.reyes@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),
    cancelledAt:   minsAgo(31),
    roomType:      'Grand Suite',
    originalPrice: 1400,
    offer: {
      id:             'OFF-1003',
      discountPct:    30,
      discountedPrice: 980,
      createdAt:      claimed1CreatedAt,
      expiresAt:      offerExpiry(claimed1CreatedAt),
      status:         'Claimed',
      claimedBy:      'Lena Hoffmann',
      notifications:  makeNotifications(claimed1CreatedAt, [
        { name: 'Lena Hoffmann',    email: 'lena.h@example.com',    status: 'Clicked' },
        { name: 'Tom Nguyen',       email: 't.nguyen@example.com',   status: 'Seen'    },
        { name: 'Sara Mitchell',    email: 'sara.m@example.com',     status: 'Sent'    },
        { name: 'Raj Patel',        email: 'raj.p@example.com',      status: 'Sent'    },
        { name: 'Elena Vasquez',    email: 'e.vasquez@example.com',  status: 'Sent'    },
        { name: 'Noah Brennan',     email: 'n.brennan@example.com',  status: 'Sent'    },
      ]),
    },
  },

  // 4 ─ EXPIRED
  {
    id:            'RES-2201',
    hotelName:     'Waldorf Astoria Chicago',
    hotelId:       4,
    guestName:     'Hannah Schmidt',
    guestEmail:    'h.schmidt@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),
    cancelledAt:   hrsAgo(2.5),
    roomType:      'Lake View Suite',
    originalPrice: 900,
    offer: {
      id:             'OFF-1004',
      discountPct:    25,
      discountedPrice: 675,
      createdAt:      expired1CreatedAt,
      expiresAt:      offerExpiry(expired1CreatedAt),
      status:         'Expired',
      notifications:  makeNotifications(expired1CreatedAt, [
        { name: 'Ian Fletcher',     email: 'i.fletcher@example.com', status: 'Seen'    },
        { name: 'Mei Lin',          email: 'mei.l@example.com',      status: 'Sent'    },
        { name: 'Adrian Moore',     email: 'a.moore@example.com',    status: 'Sent'    },
      ]),
    },
  },

  // 5 ─ EXPIRED
  {
    id:            'RES-1876',
    hotelName:     'Montage Laguna Beach',
    hotelId:       5,
    guestName:     'Pierre Dubois',
    guestEmail:    'p.dubois@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),
    cancelledAt:   hrsAgo(5.5),
    roomType:      'Oceanfront Suite',
    originalPrice: 1600,
    offer: {
      id:             'OFF-1005',
      discountPct:    45,
      discountedPrice: 880,
      createdAt:      expired2CreatedAt,
      expiresAt:      offerExpiry(expired2CreatedAt),
      status:         'Expired',
      notifications:  makeNotifications(expired2CreatedAt, [
        { name: 'Zoe Anderson',     email: 'z.anderson@example.com', status: 'Clicked' },
        { name: 'Samuel Okafor',    email: 's.okafor@example.com',   status: 'Seen'    },
        { name: 'Nina Johansson',   email: 'n.johansson@example.com',status: 'Seen'    },
        { name: 'Hiro Suzuki',      email: 'h.suzuki@example.com',   status: 'Sent'    },
        { name: 'Amelia Carter',    email: 'a.carter@example.com',   status: 'Sent'    },
        { name: 'Lucas Ferreira',   email: 'l.ferreira@example.com', status: 'Sent'    },
        { name: 'Ingrid Berg',      email: 'i.berg@example.com',     status: 'Sent'    },
      ]),
    },
  },

  // 6 ─ ACTIVE
  {
    id:            'RES-6103',
    hotelName:     'The St. Regis Aspen',
    hotelId:       6,
    guestName:     'Victoria Larson',
    guestEmail:    'v.larson@example.com',
    checkInDate:   addDays(new Date().toISOString(), 0),
    cancelledAt:   minsAgo(8),
    roomType:      'Aspen Suite',
    originalPrice: 1800,
    offer: {
      id:             'OFF-1006',
      discountPct:    38,
      discountedPrice: 1116,
      createdAt:      minsAgo(7),
      expiresAt:      offerExpiry(minsAgo(7)),
      status:         'Active',
      notifications:  makeNotifications(minsAgo(7), [
        { name: 'Michael Torres',   email: 'm.torres@example.com',   status: 'Seen'    },
        { name: 'Aisha Patel',      email: 'a.patel@example.com',    status: 'Sent'    },
        { name: 'Finn O\'Brien',    email: 'f.obrien@example.com',   status: 'Sent'    },
        { name: 'Clara Müller',     email: 'c.muller@example.com',   status: 'Sent'    },
      ]),
    },
  },
];

export const hotelFilterOptions = [
  { value: '', label: 'All Hotels' },
  ...Array.from(new Set(cancelledReservations.map(r => r.hotelName)))
    .map(name => ({ value: name, label: name })),
];

export const statusFilterOptions = [
  { value: '',        label: 'All Statuses' },
  { value: 'Active',  label: 'Active'  },
  { value: 'Claimed', label: 'Claimed' },
  { value: 'Expired', label: 'Expired' },
];

export const getReservationById = (id) =>
  cancelledReservations.find(r => r.id === id) || null;
