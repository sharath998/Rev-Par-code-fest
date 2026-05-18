import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageLoader from './components/common/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const HotelListing = lazy(() => import('./pages/HotelListing'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const Booking = lazy(() => import('./pages/Booking'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const MyBookings = lazy(() => import('./pages/MyBookings'));

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<HotelListing />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/booking/:hotelId/:roomId" element={<Booking />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
