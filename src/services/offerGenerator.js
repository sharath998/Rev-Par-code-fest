// ─── Last-Minute Offers Generator ───────────────────────────────────────────
// Called when a booking is cancelled — checks if within 24h of check-in,
// and if so, generates an offer + notifications.

const generateOfferId = () => `OFF-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
const generateNotifId = () => `N${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

const mockNotifiedUsers = [
  { name: 'Lena Hoffmann',    email: 'lena.h@example.com'    },
  { name: 'Marcus Reid',      email: 'm.reid@example.com'    },
  { name: 'Sophie Tan',       email: 'sophie.t@example.com'  },
  { name: 'Omar Al-Farsi',    email: 'omar.af@example.com'   },
  { name: 'Priya Nair',       email: 'priya.n@example.com'   },
  { name: 'David Kim',        email: 'd.kim@example.com'     },
  { name: 'Yuki Tanaka',      email: 'yuki.t@example.com'    },
  { name: 'Fatima Hassan',    email: 'fatima.h@example.com'  },
];

const randomUsers = (count) => {
  const shuffled = [...mockNotifiedUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const randomStatus = () => {
  const r = Math.random();
  if (r < 0.2)  return 'Clicked';
  if (r < 0.5)  return 'Seen';
  return 'Sent';
};

/**
 * Checks if cancellation is within 24h of check-in.
 * Returns null if not eligible, otherwise returns a generated offer object.
 */
export const generateLastMinuteOffer = (booking) => {
  const now = Date.now();
  const checkInTime = new Date(booking.checkIn).getTime();
  const hoursDiff = (checkInTime - now) / (1000 * 60 * 60);

  // Only generate if within 24 hours of check-in
  if (hoursDiff > 24 || hoursDiff < 0) return null;

  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1 hour

  // Random discount 25-45%
  const discountPct = 25 + Math.floor(Math.random() * 21);
  const discountedPrice = Math.round(booking.room.price * (1 - discountPct / 100));

  // Generate 3-7 notifications
  const userCount = 3 + Math.floor(Math.random() * 5);
  const users = randomUsers(userCount);

  const notifications = users.map((u, i) => ({
    id:         generateNotifId(),
    userName:   u.name,
    email:      u.email,
    notifiedAt: new Date(Date.now() + (i + 1) * 30 * 1000).toISOString(),
    status:     randomStatus(),
  }));

  return {
    id:            booking.id,
    hotelName:     booking.hotel.name,
    hotelId:       booking.hotel.id,
    guestName:     booking.guestDetails.firstName + ' ' + booking.guestDetails.lastName,
    guestEmail:    booking.guestDetails.email,
    checkInDate:   booking.checkIn,
    cancelledAt:   createdAt,
    roomType:      booking.room.type,
    originalPrice: booking.room.price,
    offer: {
      id:             generateOfferId(),
      discountPct,
      discountedPrice,
      createdAt,
      expiresAt,
      status:         'Active',
      notifications,
    },
  };
};
