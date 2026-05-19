# RevPar - Premium Hotel Booking Application

A production-ready React hotel booking application inspired by Marriott Bonvoy, featuring login-first architecture, personal dashboards, last-minute offers with live countdown timers, and admin monitoring.

## 🎯 Overview

RevPar is a comprehensive hotel booking platform with:
- **Login-first architecture** with 5 predefined users
- **Personal overview dashboard** showing loyalty points and active bookings
- **Last-minute offers system** that generates discounted deals when bookings are cancelled
- **Live countdown timers** for time-sensitive offers
- **Admin dashboard** for monitoring cancelled reservations and offer notifications
- **Premium Marriott-style UI** with clean, modern design

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd RevPar

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000` showing the login screen.

---

## 👥 Login Users

Select any of these 5 predefined users to log in (no password required):

| User | Email | Tier | Loyalty Points |
|------|-------|------|----------------|
| Sarah Mitchell | sarah.mitchell@revpar.com | Gold | 12,500 |
| James Rodriguez | james.rodriguez@revpar.com | Silver | 8,750 |
| Emma Chen | emma.chen@revpar.com | Platinum | 15,200 |
| Michael Thompson | michael.thompson@revpar.com | Silver | 6,400 |
| Olivia Martinez | olivia.martinez@revpar.com | Platinum | 19,800 |

---

## 📦 Core Features

### 1. **Login Screen**
- Beautiful card-based user selection
- Displays tier badges and loyalty points
- Premium gradient avatars

### 2. **Overview Dashboard** (`/overview`)
- User profile with loyalty points and tier status
- Current active booking display (or clean empty state)
- **Offer banner** when last-minute deals are available for the user
- Live countdown timer showing offer expiry
- Cancel booking button with confirmation modal

### 3. **Hotels Search & Booking** (`/hotels`)
- Search filters: location, check-in, check-out, guests
- Grid display of luxury hotels with images and ratings
- Hotel details page with amenities and room selection
- Guest details form
- **One active booking per user** restriction

### 4. **Cancellation Flow**
- Confirmation modal showing cancellation fee (configurable)
- Fee = 1 day's room charge (default)
- Automatically generates discounted offer for other 4 users
- Offer valid for exactly **1 hour**
- Discount: **30%** (configurable)

### 5. **Last-Minute Offers**
When a user cancels their booking:
1. Creates a discounted offer for remaining 4 users
2. Offer appears as **prominent banner** on Overview page
3. Shows hotel details, discounted price, and live countdown
4. Expires after 1 hour automatically

### 6. **Admin Dashboard** (`/admin/offers`)
- View all cancelled reservations
- See generated offers with status (Active/Claimed/Expired)
- Track notified users (who, when, status)
- Live countdown timers for active offers

---

## 🎨 Design System

### Colors
```
Background:  #F8F6F2 (Soft Cream)
Primary:     #2C2C2C (Dark Charcoal)
Accent:      #CBA135 (Luxury Gold)
```

### Typography
- **Headings:** Playfair Display (serif) - Luxury feel
- **Body:** Inter (sans-serif) - Clean readability

---

## ⚙️ Configuration

Edit `/src/config/appConfig.js` to customize:

```javascript
export const appConfig = {
  cancellationFeeDays: 1,         // Cancellation fee in days
  offerValiditySeconds: 3600,     // 1 hour
  lastMinuteDiscountPercent: 30,  // 30% off
  maxBookingsPerUser: 1,          // One booking at a time
};
```

---

## 🔄 User Flow

### Booking Flow
1. Login → Select user
2. Navigate to Hotels tab
3. Select hotel → Choose room
4. Fill guest details → Book
5. Redirected to Overview with active booking

### Cancellation → Offer Flow
1. User A cancels booking
2. Modal shows cancellation fee
3. Booking removed, offer generated
4. Other 4 users see offer banner
5. Live countdown shows time remaining
6. After 1 hour → offer expires

---

## 🏗️ Architecture

### Tech Stack
- React 18 (Create React App)
- React Router v6
- Tailwind CSS
- Context API
- localStorage (mock persistence)

### Project Structure
```
src/
├── admin/              # Admin module
├── components/layout/  # MainLayout
├── config/            # App configuration
├── context/           # AppContext (auth + bookings + offers)
├── data/              # Mock data (users, hotels)
├── hooks/             # Custom hooks (useCountdown)
├── pages/             # Login, Overview, Hotels, HotelDetails
└── App.jsx            # Routes and providers
```

---

## 📝 Available Scripts

```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
```

---

## 🔌 API-Ready Structure

Designed for easy backend integration. Simply replace AppContext localStorage calls with API endpoints.

---

## �� Documentation

- **START_HERE.md** - Quick start guide
- **QUICKSTART.md** - Detailed setup
- **INSTALLATION_SUMMARY.md** - Feature overview
- **WHAT_CHANGED.md** - Architecture details
- **LAST_MINUTE_OFFERS_FLOW.md** - Flow documentation

---

**Ready to explore luxury hotel booking! 🏨✨**
