import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCountdown } from '../hooks/useCountdown';
import appConfig from '../config/appConfig';

const CancellationModal = ({ booking, onConfirm, onCancel }) => {
  const cancellationFee = booking.room.price * appConfig.cancellationFeeDays;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="font-display text-3xl text-dark mb-4">
          Cancel Booking?
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to cancel your reservation at <strong>{booking.hotel.name}</strong>?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              Cancellation Fee:
            </p>
            <p className="text-2xl font-bold text-red-600">
              ${cancellationFee}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ({appConfig.cancellationFeeDays} day room charge)
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = ({ expiresAt }) => {
  const { hours, minutes, seconds, isExpired } = useCountdown(expiresAt);

  if (isExpired) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <div className="bg-white text-dark px-3 py-1.5 rounded-lg font-bold shadow-sm">
        {String(hours).padStart(2, '0')}
      </div>
      <span className="text-white font-bold">:</span>
      <div className="bg-white text-dark px-3 py-1.5 rounded-lg font-bold shadow-sm">
        {String(minutes).padStart(2, '0')}
      </div>
      <span className="text-white font-bold">:</span>
      <div className="bg-white text-dark px-3 py-1.5 rounded-lg font-bold shadow-sm">
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

const BookingConfirmationModal = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center animate-fade-in">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-display text-4xl text-dark mb-3">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your reservation has been successfully confirmed.
        </p>

        <div className="bg-cream rounded-xl p-6 mb-6 text-left">
          <h3 className="font-bold text-lg text-dark mb-3">{booking.hotel.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="font-semibold text-dark">
                {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="font-semibold text-dark">
                {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Room</p>
              <p className="font-semibold text-dark">{booking.room.type}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-gold text-lg">${booking.room.price}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-gold text-white rounded-lg font-semibold hover:bg-yellow-600 transition text-lg"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

const OfferCard = ({ offer, onDismiss, onBook }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(offer.id), 300);
  };

  return (
    <div
      className={`bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white mb-4 transition-all duration-300 ${
        isDismissing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition group"
        title="Not interested"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="pr-8">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-wide">Last-Minute Offer</p>
            <p className="text-white/80 text-xs">Exclusive Deal Just For You</p>
          </div>
        </div>

        {/* Hotel Info */}
        <h3 className="font-display text-3xl mb-2">
          {offer.hotelName}
        </h3>
        <p className="text-white/90 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {offer.hotelLocation}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">${offer.discountedPrice}</span>
            <span className="text-white/70">/night</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white/70 line-through text-lg">
              ${offer.originalPrice}
            </span>
            <span className="bg-white text-gold px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Save {offer.discountPercent}%
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70 mb-1">Check-in</p>
              <p className="font-semibold">
                {new Date(offer.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-white/70 mb-1">Check-out</p>
              <p className="font-semibold">
                {new Date(offer.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-white/70 mb-1">Room Type</p>
              <p className="font-semibold">{offer.roomType}</p>
            </div>
            <div>
              <p className="text-white/70 mb-1">Guests</p>
              <p className="font-semibold">{offer.guests} Guest{offer.guests > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Countdown & CTA */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-xs mb-2 uppercase tracking-wide font-semibold">Time Remaining</p>
            <CountdownTimer expiresAt={offer.expiresAt} />
          </div>
          <button
            onClick={() => onBook(offer)}
            className="px-8 py-4 bg-white text-gold rounded-xl font-bold hover:bg-cream transition shadow-2xl text-lg group flex items-center gap-2"
          >
            Book Now
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const CurrentBooking = ({ booking, onCancel }) => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-dark">Current Booking</h3>
        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          Active
        </span>
      </div>

      <div className="flex gap-6">
        <img
          src={booking.hotel.thumbnail}
          alt={booking.hotel.name}
          className="w-48 h-32 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h4 className="font-bold text-xl text-dark mb-2">
            {booking.hotel.name}
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            {booking.hotel.location}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <p className="font-semibold text-dark">{checkInDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <p className="font-semibold text-dark">{checkOutDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Room Type</p>
              <p className="font-semibold text-dark">{booking.room.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Guests</p>
              <p className="font-semibold text-dark">{booking.guests}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-gold">
                ${booking.room.price}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-12 text-center mb-8">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 className="font-display text-2xl text-dark mb-2">No Active Bookings</h3>
      <p className="text-gray-600">
        You don't have any active bookings at the moment.
      </p>
    </div>
  );
};

const Overview = () => {
  const { currentUser, getUserBookings, getActiveOffersForUser, cancelBooking, dismissOffer, bookOffer } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const userBookings = getUserBookings(currentUser?.id);
  const activeBooking = userBookings[0] || null;
  const offers = getActiveOffersForUser(currentUser?.id);

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      const result = cancelBooking(bookingToCancel.id);
      if (result.success) {
        setShowCancelModal(false);
        setBookingToCancel(null);
      }
    }
  };

  const handleDismissOffer = (offerId) => {
    dismissOffer(offerId, currentUser?.id);
  };

  const handleBookOffer = (offer) => {
    const result = bookOffer(offer.id, currentUser?.id);
    if (result.success) {
      setConfirmedBooking(result.booking);
      setShowConfirmation(true);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      {/* User Header */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-dark mb-2">
              Welcome back, {currentUser?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Loyalty Points</p>
            <p className="text-3xl font-bold text-gold">
              {currentUser?.loyaltyPoints?.toLocaleString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                currentUser?.tier === 'Platinum'
                  ? 'bg-gray-800 text-white'
                  : currentUser?.tier === 'Gold'
                  ? 'bg-gold text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {currentUser?.tier} Member
            </span>
          </div>
        </div>
      </div>

      {/* Active Offers */}
      {offers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{offers.length}</span>
            </div>
            <h2 className="font-display text-2xl text-dark">
              Exclusive Offer{offers.length > 1 ? 's' : ''} Available
            </h2>
          </div>
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="relative">
                <OfferCard
                  offer={offer}
                  onDismiss={handleDismissOffer}
                  onBook={handleBookOffer}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Booking or Empty State */}
      {activeBooking ? (
        <CurrentBooking booking={activeBooking} onCancel={() => handleCancelClick(activeBooking)} />
      ) : (
        <EmptyState />
      )}

      {/* Cancellation Modal */}
      {showCancelModal && bookingToCancel && (
        <CancellationModal
          booking={bookingToCancel}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      )}

      {/* Booking Confirmation Modal */}
      {showConfirmation && confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => {
            setShowConfirmation(false);
            setConfirmedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default Overview;
