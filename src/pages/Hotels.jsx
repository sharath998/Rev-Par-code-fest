import React, { useState } from 'react';
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
