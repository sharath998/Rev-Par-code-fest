# Last-Minute Offers — Flow Documentation

## How It Works

When a user **cancels a booking** from the **My Bookings** page, the system automatically checks if the cancellation qualifies as a "last-minute" cancellation. If it does, an offer is generated and appears in the **Admin Dashboard**.

---

## Cancellation → Offer Generation Flow

### 1️⃣ User cancels a booking
**Location:** `/my-bookings`  
**Action:** Click "Cancel Booking" button on any active booking

### 2️⃣ System checks eligibility
**Rule:** Cancellation must be **within 24 hours** of the check-in date

**Code:** `src/services/offerGenerator.js`
```javascript
const checkInTime = new Date(booking.checkIn).getTime();
const hoursDiff = (checkInTime - now) / (1000 * 60 * 60);

if (hoursDiff > 24 || hoursDiff < 0) return null; // Not eligible
```

### 3️⃣ Generate last-minute offer
If eligible, the system automatically creates:

**Offer details:**
- Discount: Random 25-45% off original room price
- Valid for: Exactly **1 hour** from creation time
- Status: `Active`

**Notifications:**
- Random 3-7 users are "notified"
- Each notification has:
  - User name & email
  - Timestamp
  - Status: `Sent` / `Seen` / `Clicked` (randomly assigned)

### 4️⃣ Save to localStorage
**Key:** `revpar_last_minute_offers`  
**Data structure:**
```json
[
  {
    "id": "BK1747563142891",
    "hotelName": "The Ritz-Carlton New York",
    "guestName": "John Doe",
    "checkInDate": "2026-05-19T...",
    "cancelledAt": "2026-05-18T...",
    "roomType": "Deluxe King Room",
    "originalPrice": 895,
    "offer": {
      "id": "OFF-AB12",
      "discountPct": 35,
      "discountedPrice": 582,
      "createdAt": "2026-05-18T...",
      "expiresAt": "2026-05-18T...",  // createdAt + 1 hour
      "status": "Active",
      "notifications": [
        {
          "id": "N3KF92",
          "userName": "Lena Hoffmann",
          "email": "lena.h@example.com",
          "notifiedAt": "2026-05-18T...",
          "status": "Clicked"
        }
      ]
    }
  }
]
```

### 5️⃣ Admin dashboard shows the offer
**Location:** `/admin/offers`  
The offer appears **immediately** in:
- Stats bar (increments "Active Offers")
- Cancelled Reservations table (top row, newest first)
- Live countdown timer starts ticking

---

## Testing the Flow

### Step-by-step test:

1. **Book a hotel:**
   - Go to home page
   - Search for a hotel
   - Select a room
   - Complete booking with check-in date = **today** or **tomorrow**

2. **Cancel the booking:**
   - Go to `/my-bookings`
   - Click "Cancel Booking"
   - Confirm cancellation

3. **Check admin dashboard:**
   - Navigate to `/admin/offers` (or click "Admin" in header)
   - Your cancelled booking should appear at the **top of the table**
   - Countdown timer shows time remaining (1 hour from cancellation)
   - Click the row to see:
     - Offer pricing (discounted vs original)
     - Expiry countdown
     - List of notified users with engagement status

---

## Key Files

| File | Purpose |
|------|---------|
| `src/context/BookingContext.jsx` | Cancellation logic + triggers offer generation |
| `src/services/offerGenerator.js` | Checks 24h rule, generates offer + notifications |
| `src/services/offersService.js` | Merges localStorage offers + static mock data |
| `src/data/lastMinuteOffers.js` | Static mock data (6 pre-seeded offers) |
| `src/admin/pages/OffersAdmin.jsx` | Admin dashboard page |
| `src/admin/components/ReservationsTable.jsx` | Shows all offers with live timers |
| `src/admin/hooks/useCountdown.js` | Live countdown (re-renders every second) |

---

## Storage Keys

| Key | Data |
|-----|------|
| `revpar_bookings` | All user bookings (Booked / Cancelled) |
| `revpar_last_minute_offers` | Dynamically generated offers from cancellations |

---

## Offer Lifecycle

```
User cancels booking (< 24h before check-in)
        ↓
Generate offer (discount, 1h expiry)
        ↓
Save to localStorage
        ↓
Admin sees in dashboard (Active)
        ↓
After 1 hour → status auto-updates to "Expired"
        ↓
Admin can still view expired offers in table
```

---

## Future API Integration

Replace localStorage logic with backend calls:

**POST /api/admin/offers** (called from `offerGenerator.js`)
```javascript
export const generateLastMinuteOffer = async (booking) => {
  const response = await fetch('/api/admin/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  return response.json();
};
```

**GET /api/admin/offers** (called from `offersService.js`)
```javascript
async getAll(filters) {
  const query = new URLSearchParams(filters);
  const response = await fetch(`/api/admin/offers?${query}`);
  return response.json();
}
```

---

## Notes

- Offers expire after **1 hour** (fixed duration)
- Countdown timer updates **every second** via `useCountdown` hook
- If check-in is > 24 hours away, **no offer is generated**
- Notifications are **mock data** (random users, random engagement)
- Admin dashboard shows **combined data**: localStorage (dynamic) + static mocks

---

Generated: 2026-05-18  
RevPar Hotel Booking System
