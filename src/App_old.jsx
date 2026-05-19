import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageLoader from './components/common/PageLoader';

const Home         = lazy(() => import('./pages/Home'));
const HotelListing = lazy(() => import('./pages/HotelListing'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const Booking      = lazy(() => import('./pages/Booking'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const MyBookings   = lazy(() => import('./pages/MyBookings'));
const OffersAdmin  = lazy(() => import('./admin/pages/OffersAdmin'));

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                          element={<Home />} />
            <Route path="/hotels"                    element={<HotelListing />} />
            <Route path="/hotel/:id"                 element={<HotelDetails />} />
            <Route path="/booking/:hotelId/:roomId"  element={<Booking />} />
            <Route path="/confirmation/:bookingId"   element={<Confirmation />} />
            <Route path="/my-bookings"               element={<MyBookings />} />
            {/* ── Admin module (standalone, no shared Header/Footer) ── */}
            <Route path="/admin/offers"              element={<OffersAdmin />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
