import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCountdown } from '../hooks/useCountdown';
import appConfig from '../config/appConfig';
import MatchInsightsCard from '../components/notifications/MatchInsightsCard';

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
              ({appConfig.cancellationFeeDays} night room charge)
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

const FlameIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 1 0 16 0C20 9.9 18.07 6.04 15.36 3.31L13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
  </svg>
);

const BoltIcon = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11 21h-1l1-7H6.5c-.88 0-.33-.75-.31-.78 1.26-2.23 3.15-5.53 5.65-9.93h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z"/>
  </svg>
);

const OfferSpotlight = ({ offer, onDismiss, onExplore, onExpire }) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const { hours, minutes, isExpired } = useCountdown(offer.expiresAt);
  const isUrgent = !isExpired && hours === 0 && minutes < 15;

  useEffect(() => {
    if (isExpired && onExpire) onExpire(offer.id);
  }, [isExpired, offer.id, onExpire]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(offer.id), 300);
  };

  if (isExpired) return null;

  return (
    <div
      className={`relative rounded-[32px] p-[2px] animate-glow-pulse bg-[length:300%_300%] animate-gradient-shift transition-all duration-300 ${
        isDismissing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, #CBA135 0%, #FFE6A8 20%, #FF8A00 40%, #CBA135 60%, #9A6A1F 80%, #CBA135 100%)',
      }}
    >
      <div className="relative overflow-hidden rounded-[30px] bg-[#1C1C1C] p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(203,161,53,0.45),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(255,138,0,0.18),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5A1E] via-[#FF8A00] to-[#CBA135] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-lg animate-flash-pulse">
                <FlameIcon className="h-4 w-4 text-yellow-200 animate-flame" />
                Priority Offer
              </span>
              {/* <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFD37A]">
                <BoltIcon className="h-4 w-4 animate-flame" />
                Vanishing fast — book before it&apos;s gone
              </span> */}
            </div>

            <h3 className="font-display text-4xl md:text-5xl leading-tight mb-3 drop-shadow-[0_2px_18px_rgba(203,161,53,0.35)]">
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

            <div className="flex flex-wrap items-end gap-5">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Flash rate</p>
                <div className="flex items-end gap-3">
                  <span className="font-display text-6xl text-white drop-shadow-[0_4px_24px_rgba(203,161,53,0.55)]">
                    ${offer.discountedPrice}
                  </span>
                  <span className="pb-2 text-white/65">/ night</span>
                </div>
              </div>
              <div className="pb-2">
                <p className="text-sm text-white/55 line-through">${offer.originalPrice}</p>
                <p className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFE6A8] via-white to-[#FFE6A8] px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider text-[#7A4A00] shadow-[0_6px_22px_rgba(255,180,40,0.45)] animate-savings-pop">
                  <BoltIcon className="h-3.5 w-3.5" />
                  Save {offer.discountPercent}%
                </p>
              </div>
            </div>
          </div>

          <div
            className={`relative rounded-[24px] border bg-white/8 p-6 backdrop-blur-sm transition-colors ${
              isUrgent ? 'border-[#FF6B6B]/60' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Time remaining</p>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FF3B3B]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF8A8A] animate-urgent-pulse">
                  <FlameIcon className="h-3 w-3" />
                  Hurry
                </span>
              )}
            </div>
            <div className={`mt-3 mb-6 ${isUrgent ? 'animate-urgent-pulse' : ''}`}>
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
              className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFE6A8] via-white to-[#FFE6A8] px-6 py-4 text-base font-bold uppercase tracking-[0.18em] text-[#2C2C2C] shadow-[0_10px_30px_rgba(203,161,53,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(203,161,53,0.6)]"
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                Grab This Deal
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            <p className="mt-3 text-center text-xs text-white/60">
              We&rsquo;ll take you to the hotel page with dates and room preselected.
            </p>
          </div>
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

const NightsHalfClock = ({ nights, size = 180 }) => {
  const maxNights = 7;
  const ratio = Math.max(0, Math.min(nights / maxNights, 1));

  const cx = 110;
  const cy = 110;
  const r = 80;

  // Text scales proportionally with the size prop (180 = original baseline)
  const numberFontSize = Math.round(size * 0.22);   // big nights number
  const labelFontSize  = Math.max(9, Math.round(size * 0.055)); // "Night/Nights" + "Stay Duration"
  const numberTopPx    = Math.round(size * 0.14);   // distance from top to number

  const polar = (angleDeg) => ({
    x: cx + r * Math.cos((angleDeg * Math.PI) / 180),
    y: cy - r * Math.sin((angleDeg * Math.PI) / 180),
  });

  const start = polar(180);
  const end = polar(0);
  const filledEnd = polar(180 - 180 * ratio);

  const tickAngles = [180, 150, 120, 90, 60, 30, 0];
  const ticks = tickAngles.map((a) => {
    const inner = {
      x: cx + (r - 12) * Math.cos((a * Math.PI) / 180),
      y: cy - (r - 12) * Math.sin((a * Math.PI) / 180),
    };
    const outer = {
      x: cx + (r + 8) * Math.cos((a * Math.PI) / 180),
      y: cy - (r + 8) * Math.sin((a * Math.PI) / 180),
    };
    return { inner, outer };
  });

  return (
    <div className="relative select-none" style={{ width: `${size}px` }}>
      <svg viewBox="0 0 220 140" className="w-full overflow-visible">
        <defs>
          <linearGradient id="nightsGoldArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9A6A1F" />
            <stop offset="45%" stopColor="#CBA135" />
            <stop offset="80%" stopColor="#FFE6A8" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
          <filter id="nightsGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="#EAE7E0"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${filledEnd.x} ${filledEnd.y}`}
          fill="none"
          stroke="url(#nightsGoldArc)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#nightsGoldGlow)"
        />

        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke="#C9C4BB"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        <circle
          cx={filledEnd.x}
          cy={filledEnd.y}
          r="7"
          fill="#FFFFFF"
          stroke="#CBA135"
          strokeWidth="2.5"
          filter="url(#nightsGoldGlow)"
        />
        <circle cx={filledEnd.x} cy={filledEnd.y} r="2.5" fill="#CBA135" />
        <circle cx={cx} cy={cy} r="4" fill="#2C2C2C" />
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
        style={{ top: `${numberTopPx}px` }}
      >
        <span
          className="font-display font-bold leading-none text-[#2C2C2C] drop-shadow-[0_2px_14px_rgba(203,161,53,0.4)]"
          style={{ fontSize: `${numberFontSize}px` }}
        >
          {nights}
        </span>
        <span
          className="mt-1 font-bold uppercase tracking-[0.32em] text-[#9A8A57]"
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {nights === 1 ? 'Night' : 'Nights'}
        </span>
      </div>

      <p
        className="-mt-2 text-center font-semibold uppercase tracking-[0.28em] text-[#9A8A57]"
        style={{ fontSize: `${labelFontSize}px` }}
      >
        Stay Duration
      </p>
    </div>
  );
};

// ─── Tweakable: vertical offset of the nights gauge above the Cancel button ──
// Use negative values to pull the gauge UP (e.g. -32, -64, -80, -96, -120).
// Use positive values to push it DOWN. Unit: pixels.
const NIGHTS_GAUGE_OFFSET_PX = -94;

// Gap (in pixels) between the night gauge and the Cancel Booking button.
const NIGHTS_GAUGE_BUTTON_GAP_PX = 34;

// Overall width (in pixels) of the night gauge. Internal text scales with it.
// Baseline was 180. Try 220, 260, 300, 360 for bigger.
const NIGHTS_GAUGE_SIZE_PX = 260;

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

  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
    )
  );

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
          className="w-80 h-64 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h4 className="font-bold text-xl text-dark mb-2">
            {booking.hotel.name}
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            {booking.hotel.location}
          </p>

          <div className="grid grid-cols-[max-content_max-content] gap-x-60 gap-y-4 mb-4">
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

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-gold">
                ${booking.room.price}
              </p>
            </div>
            <div
              className="flex flex-col items-center"
              style={{
                marginTop: `${NIGHTS_GAUGE_OFFSET_PX}px`,
                gap: `${NIGHTS_GAUGE_BUTTON_GAP_PX}px`,
              }}
            >
              <NightsHalfClock nights={nights} size={NIGHTS_GAUGE_SIZE_PX} />
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
    </div>
  );
};

const EmptyState = ({ onExploreHotels }) => {
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
      {/* <p className="text-gray-600">
        You don't have any active bookings at the moment.
      </p> */}
      <button
        onClick={onExploreHotels}
        className="group mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2C2C2C] to-[#4a4a4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        Explore Hotels
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#CBA135] text-[#2C2C2C] transition-transform duration-300 group-hover:translate-x-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

const Overview = () => {
  const navigate = useNavigate();
  const { currentUser, getUserBookings, getActiveOffersForUser, cancelBooking, dismissOffer } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [insights, setInsights] = useState(null);

  const userBookings = getUserBookings(currentUser?.id);
  const activeBooking = userBookings[0] || null;
  const offers = getActiveOffersForUser(currentUser?.id);
  const primaryOffer = offers[0] || null;

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
        // Pop the AI match insights card for the canceller
        if (result.offer && Array.isArray(result.offer.ranking)) {
          setInsights({
            ranking: result.offer.ranking,
            notifiedIds: result.offer.notifiedUserIds,
          });
        }
      }
    }
  };

  const handleDismissOffer = (offerId) => {
    dismissOffer(offerId, currentUser?.id);
  };

  const [, setExpiredTick] = useState(0);
  const handleOfferExpire = useCallback(() => {
    setExpiredTick((t) => t + 1);
  }, []);

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

  const handleExploreHotels = () => {
    navigate('/hotels');
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
            {/* <p className="text-gray-600">{currentUser?.email}</p> */}
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
          </div>

          <OfferSpotlight
            offer={primaryOffer}
            onDismiss={handleDismissOffer}
            onExplore={handleExploreOffer}
            onExpire={handleOfferExpire}
          />

        </div>
      )}

      {/* Current Booking or Empty State */}
      {activeBooking ? (
        <CurrentBooking booking={activeBooking} onCancel={() => handleCancelClick(activeBooking)} />
      ) : (
        <EmptyState onExploreHotels={handleExploreHotels} />
      )}

      {/* Cancellation Modal */}
      {showCancelModal && bookingToCancel && (
        <CancellationModal
          booking={bookingToCancel}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      )}

      {/* AI Match Insights — shown to the canceller right after cancellation */}
      {insights && (
        <MatchInsightsCard
          ranking={insights.ranking}
          notifiedIds={insights.notifiedIds}
          onDismiss={() => setInsights(null)}
        />
      )}
    </div>
  );
};

export default Overview;
