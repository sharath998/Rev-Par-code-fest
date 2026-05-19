# RevPar — Hotel Booking + Last-Minute Offers Admin

A production-ready React hotel booking application with an integrated **Last-Minute Offers Admin Dashboard**.

---

## Features

### 🏨 Main Booking App
- **Home** — Hero search, featured hotels, destinations
- **Hotel Listing** — Filters (price, rating, amenities)
- **Hotel Details** — Image gallery, rooms, amenities
- **Booking Flow** — Guest form, validation, confirmation
- **My Bookings** — View and cancel bookings

### ⚡ Last-Minute Offers (Admin Module)
- **Auto-generate offers** when bookings are cancelled < 24h before check-in
- **Live countdown timers** (1-hour expiry)
- **Notification tracking** (Sent / Seen / Clicked)
- **Standalone admin dashboard** at `/admin/offers`
- **Real-time stats** (Active, Claimed, Expired offers)

---

## Tech Stack

- **React 18** with hooks & context
- **React Router v6**
- **Tailwind CSS** (premium Marriott-style design)
- **react-hot-toast** for notifications
- **localStorage** for persistence (swap with APIs later)

---

## Getting Started

### Install dependencies
```bash
cd RevPar
npm install
```

### Run development server
```bash
npm start
```

App runs at: `http://localhost:3000`

### Access Admin Dashboard
Navigate to: `http://localhost:3000/admin/offers`  
Or click **"Admin"** pill in the main header.

---

## How Last-Minute Offers Work

### Trigger: User cancels a booking
1. User goes to **My Bookings** (`/my-bookings`)
2. Clicks **"Cancel Booking"**

### Automatic Check:
- Is cancellation < **24 hours** before check-in?
  - ✅ **Yes** → Generate offer
  - ❌ **No** → Just cancel, no offer

### Offer Details:
- Discount: **25-45%** off (random)
- Valid for: **1 hour** exactly
- Notifications: **3-7 mock users** notified
- Status: `Active` → `Expired` (after 1hr)

### View in Admin:
- Navigate to `/admin/offers`
- See all cancelled reservations with:
  - Live countdown timer
  - Offer pricing
  - Notified users + engagement (Sent/Seen/Clicked)

**See full flow:** [LAST_MINUTE_OFFERS_FLOW.md](./LAST_MINUTE_OFFERS_FLOW.md)

---

## Testing the Full Flow

1. **Book a hotel:**
   - Set check-in = today or tomorrow
   - Complete booking

2. **Cancel the booking:**
   - Go to "My Bookings"
   - Click "Cancel Booking"

3. **Check admin dashboard:**
   - Click "Admin" in header (or go to `/admin/offers`)
   - Your cancelled booking appears at the top
   - Live countdown timer starts (1 hour)

4. **Inspect offer:**
   - Click the row
   - See discounted price, notified users, engagement stats

---

## Storage (localStorage)

| Key | Data |
|-----|------|
| `revpar_bookings` | User bookings (Booked / Cancelled) |
| `revpar_last_minute_offers` | Auto-generated offers from cancellations |

**To reset:** Clear localStorage in browser DevTools.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm test` | Run tests |

---

## License

MIT

---

**Built with ❤️ using React + Tailwind CSS**  
Premium Marriott-inspired design · Production-ready · API-ready architecture
