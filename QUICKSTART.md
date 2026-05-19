# 🚀 Quick Setup Guide - RevPar Hotel Booking App

## What You Have

A complete, production-ready React hotel booking application with:

✅ Login system (5 predefined users)
✅ Personal dashboard with bookings & loyalty points
✅ Hotel search and booking
✅ Cancellation flow with offers generation
✅ Last-minute offers with live countdown timers
✅ Admin dashboard for monitoring
✅ Premium Marriott-style UI

---

## How to Run

### 1. Install Dependencies

```bash
npm install
```

**Note:** If you encounter SSL certificate errors (corporate proxy), refer to `npm-ssl-fix-steps.txt` in this directory.

### 2. Start Development Server

```bash
npm start
```

The app will automatically open at **http://localhost:3000**

---

## First-Time User Guide

### Step 1: Login
- You'll see 5 user cards
- Click any card to login (no password needed)
- Try **Sarah Mitchell** (Gold member with 12,500 points)

### Step 2: Explore Overview
- See your loyalty points and tier
- Currently no active bookings (empty state)

### Step 3: Book a Hotel
- Click the **"Hotels"** tab
- Browse luxury hotels
- Click any hotel → View details
- Select a room type
- Fill in guest details → **Book Now**

### Step 4: View Your Booking
- Redirected to Overview
- See your active booking card
- Note: You can only have **1 active booking** at a time

### Step 5: Test Cancellation → Offer Flow
- Click **"Cancel Booking"**
- Modal shows cancellation fee ($XX for 1 day charge)
- Click **"Cancel Booking"** to confirm
- ✨ **Offer generated for other 4 users!**

### Step 6: Login as Another User
- Logout (top right button)
- Login as **James Rodriguez**
- 🎉 **See the offer banner** on Overview!
- Banner shows:
  - Hotel details
  - Discounted price (30% off)
  - **Live countdown timer** (1 hour validity)

### Step 7: Check Admin Dashboard
- Click **"Admin Dashboard"** tab
- See all cancelled reservations
- View offer details
- Check notified users list
- Watch live countdown timers

---

## Testing Scenarios

### Scenario 1: Complete Booking Flow
```
Login → Hotels → Select Hotel → Book → View in Overview
```

### Scenario 2: Cancellation + Offer
```
Cancel booking → Other users see offer → Live countdown
```

### Scenario 3: Multi-User Offers
```
User A cancels → Users B,C,D,E get notified → Each sees offer banner
```

### Scenario 4: Offer Expiry
```
Wait 1 hour → Offer expires → Banner disappears
```

### Scenario 5: Admin Monitoring
```
Admin Dashboard → View all offers → Track notifications → Monitor expiry
```

---

## Configuration

Want to change settings? Edit `/src/config/appConfig.js`:

```javascript
{
  cancellationFeeDays: 1,         // Change to 2 for 2-day fee
  offerValiditySeconds: 3600,     // Change to 7200 for 2 hours
  lastMinuteDiscountPercent: 30,  // Change to 40 for 40% off
  maxBookingsPerUser: 1,          // Change to 3 for multiple bookings
}
```

---

## Data Locations

### Mock Data Files
- **Users**: `/src/data/users.js` (5 users)
- **Hotels**: `/src/data/hotels.js` (8 luxury hotels)

### Storage (Browser localStorage)
- `revpar_current_user` - Logged-in user
- `revpar_bookings` - All bookings
- `revpar_offers` - Generated offers

**To reset everything:** Clear browser localStorage or use DevTools → Application → Clear Storage

---

## Troubleshooting

### Issue: npm install fails with SSL error
**Solution:** Follow instructions in `npm-ssl-fix-steps.txt`

### Issue: App doesn't start
```bash
# Make sure dependencies are installed
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Login doesn't work
- Check browser console for errors
- Clear localStorage
- Refresh the page

### Issue: Countdown timer not updating
- Refresh the page
- Check if offer has expired
- Clear localStorage and create new offer

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `/src/context/AppContext.jsx` | Global state management |
| `/src/config/appConfig.js` | All configurable settings |
| `/src/pages/Login.jsx` | Login screen |
| `/src/pages/Overview.jsx` | Dashboard with bookings/offers |
| `/src/pages/Hotels.jsx` | Hotel search & listing |
| `/src/admin/pages/OffersAdmin.jsx` | Admin dashboard |
| `/src/hooks/useCountdown.js` | Live countdown timer |

---

## Next Steps

1. ✅ Run the app and explore all features
2. ✅ Test the complete booking → cancellation → offer flow
3. ✅ Try logging in as different users
4. ✅ Monitor offers in Admin dashboard
5. 📝 Review the code structure
6. 🔧 Customize configuration as needed
7. 🚀 Plan backend API integration (see README.md)

---

## Production Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `/build` folder.

### Deploy Options
- **Netlify**: Drop `/build` folder
- **Vercel**: Connect GitHub repo
- **AWS S3**: Upload `/build` folder
- **Firebase Hosting**: `firebase deploy`

---

## Support

For detailed documentation, see **README.md**

For flow diagrams, see **LAST_MINUTE_OFFERS_FLOW.md**

---

**Enjoy exploring RevPar! 🏨✨**
