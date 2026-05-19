# RevPar - Premium Hotel Booking Application

A production-ready React web application for hotel booking, inspired by Marriott Bonvoy's premium design aesthetic.

## Features

- 🏨 **Home Page** - Hero banner with search, featured hotels and destinations
- 🔍 **Hotel Listing** - Searchable and filterable hotel listings
- 📖 **Hotel Details** - Image gallery, amenities, room selection
- 📝 **Booking Flow** - Guest details form with validation
- ✅ **Confirmation** - Booking confirmation with summary
- 📋 **My Bookings** - View and cancel bookings
- 💾 **Persistent Storage** - Bookings saved to localStorage

## Tech Stack

- **React 18** - UI library with hooks and context
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **react-hot-toast** - Toast notifications

## Project Structure

```
src/
├── components/
│   ├── booking/      # BookingCard, BookingForm
│   ├── common/       # PageLoader, Skeleton
│   ├── hotel/        # HotelCard, ImageGallery, RoomCard
│   ├── layout/       # Header, Footer
│   └── search/       # SearchBar, Filters
├── context/
│   ├── BookingContext.jsx   # Booking state management
│   └── SearchContext.jsx    # Search state management
├── data/
│   └── hotels.js     # Mock hotel data
├── pages/
│   ├── Home.jsx
│   ├── HotelListing.jsx
│   ├── HotelDetails.jsx
│   ├── Booking.jsx
│   ├── Confirmation.jsx
│   └── MyBookings.jsx
├── services/
│   └── api.js        # API-ready service layer
├── App.jsx
├── index.js
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone or navigate to the project
cd RevPar

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## API Integration

The app is structured for easy API integration. Replace mock data in `src/services/api.js`:

```javascript
// Current (mock)
export const hotelService = {
  async getAll() {
    await delay(300);
    return { data: hotels, success: true };
  }
};

// Future (real API)
export const hotelService = {
  async getAll() {
    const response = await fetch('/api/hotels');
    return response.json();
  }
};
```

## Key Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes

### Premium UI
- Elegant typography (Playfair Display + Inter)
- Subtle shadows and smooth transitions
- Consistent color palette (Navy, Gold accents)

### State Management
- React Context for global state
- localStorage persistence for bookings
- URL-based search params

### Form Validation
- Client-side validation
- Error feedback
- Required field handling

## Mock Data

8 luxury hotels with:
- Multiple images per hotel
- Various room types
- Amenities lists
- Ratings and reviews

## License

MIT
