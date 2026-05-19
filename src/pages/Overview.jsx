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

const OfferSpotlight = ({ offer, onDismiss, onExplore }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(offer.id), 300);
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#2C2C2C] rounded-[28px] shadow-soft-lg p-8 text-white transition-all duration-300 ${
        isDismissing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(203,161,53,0.4),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent)]" />
      <button
        onClick={handleDismiss}
        className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
        title="Not interested"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-[#CBA135] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#2C2C2C]">
              Priority Offer
            </span>
            <span className="text-sm text-white/70">Available for the next hour only</span>
          </div>

          <h3 className="font-display text-4xl md:text-5xl leading-tight mb-3">
            {offer.hotelName}
          </h3>
          <p className="mb-6 max-w-2xl text-base text-white/78">
            A freshly released stay at {offer.hotelLocation}. Explore the property, review the room details, and decide at your pace before the clock runs out.
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/85">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              {offer.roomType}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              {new Date(offer.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' '}–{' '}
              {new Date(offer.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              {offer.guests} Guest{offer.guests > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">Offer rate</p>
              <div className="flex items-end gap-3">
                <span className="font-display text-5xl text-white">${offer.discountedPrice}</span>
                <span className="pb-2 text-white/65">/ night</span>
              </div>
            </div>
            <div className="pb-2">
              <p className="text-sm text-white/55 line-through">${offer.originalPrice}</p>
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#2C2C2C]">
                Save {offer.discountPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Time remaining</p>
          <div className="mt-3 mb-6">
            <CountdownTimer expiresAt={offer.expiresAt} />
          </div>

          <div className="space-y-3 rounded-2xl bg-black/10 p-4 text-sm text-white/82">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Check-in</span>
              <span className="font-semibold">
                {new Date(offer.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Check-out</span>
              <span className="font-semibold">
                {new Date(offer.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Selected room</span>
              <span className="font-semibold">{offer.roomType}</span>
            </div>
          </div>

          <button
            onClick={() => onExplore(offer)}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-[#2C2C2C] transition hover:bg-[#F8F6F2]"
          >
            Explore This Offer
          </button>
          <p className="mt-3 text-center text-xs text-white/60">
            We’ll take you to the hotel page with dates and room preselected.
          </p>
        </div>
      </div>
    </div>
  );
};

const OfferListItem = ({ offer, onDismiss, onExplore }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(offer.id), 250);
  };

  return (
    <div
      className={`rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-soft transition-all duration-300 ${
        isDismissing ? 'opacity-0 -translate-y-2' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A8A57]">Offer</p>
          <h4 className="font-display text-2xl text-dark">{offer.hotelName}</h4>
          <p className="mt-1 text-sm text-gray-500">{offer.hotelLocation}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE7E0] text-gray-500 transition hover:border-gray-300 hover:text-dark"
          title="Not interested"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-[#F8F6F2] px-3 py-1.5 text-dark">{offer.roomType}</span>
        <span className="rounded-full bg-[#F8F6F2] px-3 py-1.5 text-dark">${offer.discountedPrice}/night</span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Expires in</p>
          <div className="flex items-center gap-2 text-xs">
            <CountdownTimer expiresAt={offer.expiresAt} />
          </div>
        </div>
        <button
          onClick={() => onExplore(offer)}
          className="rounded-xl border border-[#2C2C2C] px-5 py-3 text-sm font-semibold text-[#2C2C2C] transition hover:bg-[#2C2C2C] hover:text-white"
        >
          View hotel
        </button>
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
  const navigate = useNavigate();
  const { currentUser, getUserBookings, getActiveOffersForUser, cancelBooking, dismissOffer } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const userBookings = getUserBookings(currentUser?.id);
  const activeBooking = userBookings[0] || null;
  const offers = getActiveOffersForUser(currentUser?.id);
  const primaryOffer = offers[0] || null;
  const secondaryOffers = offers.slice(1);

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

  const handleExploreOffer = (offer) => {
    navigate(`/hotel/${offer.hotelId}`, {
      state: {
        searchFilters: {
          checkIn: offer.checkIn,
          checkOut: offer.checkOut,
          guests: offer.guests,
        },
        offer,
        preselectedRoomType: offer.roomType,
      },
    });
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
      {offers.length > 0 && primaryOffer && (
        <div className="mb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A8A57]">
                Last-minute invitations
              </p>
              <h2 className="font-display text-3xl text-dark">
                Exclusive Offer{offers.length > 1 ? 's' : ''} Curated For You
              </h2>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-dark shadow-soft">
              {offers.length} active
            </div>
          </div>

          <OfferSpotlight
            offer={primaryOffer}
            onDismiss={handleDismissOffer}
            onExplore={handleExploreOffer}
          />

          {secondaryOffers.length > 0 && (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {secondaryOffers.map((offer) => (
                <OfferListItem
                  key={offer.id}
                  offer={offer}
                  onDismiss={handleDismissOffer}
                  onExplore={handleExploreOffer}
                />
              ))}
            </div>
          )}
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
    </div>
  );
};

export default Overview;
