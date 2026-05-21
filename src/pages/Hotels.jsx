import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotels } from '../data/hotels';
import { useApp } from '../context/AppContext';
import { useCountdown } from '../hooks/useCountdown';

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

const Hotels = () => {
  const navigate = useNavigate();
  const { currentUser, getActiveOffersForUser, dismissOffer } = useApp();
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter logic can be added here
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (searchFilters.location && !hotel.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
      return false;
    }
    return true;
  });
  const primaryOffer = getActiveOffersForUser(currentUser?.id)[0] || null;

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

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <h2 className="font-display text-2xl text-dark mb-4">Search Hotels</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Location"
            value={searchFilters.location}
            onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="date"
            value={searchFilters.checkIn}
            onChange={(e) => setSearchFilters({ ...searchFilters, checkIn: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="date"
            value={searchFilters.checkOut}
            onChange={(e) => setSearchFilters({ ...searchFilters, checkOut: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <select
            value={searchFilters.guests}
            onChange={(e) => setSearchFilters({ ...searchFilters, guests: parseInt(e.target.value) })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </form>
      </div>

      {primaryOffer && (
        <div className="mb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A8A57]">
                Last-minute invitation
              </p>
              <h2 className="font-display text-3xl text-dark">
                Exclusive Offer For You
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

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/hotel/${hotel.id}`, { state: { searchFilters } })}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={hotel.thumbnail}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {hotel.featured && (
                <span className="absolute top-4 left-4 bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>

            <div className="p-6">
              <h3 className="font-display text-xl text-dark mb-2">
                {hotel.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{hotel.location}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(hotel.rating)
                          ? 'text-gold fill-current'
                          : 'text-gray-300 fill-current'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {hotel.rating}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-xl font-bold text-gold">
                    ${hotel.rooms[0]?.price || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
