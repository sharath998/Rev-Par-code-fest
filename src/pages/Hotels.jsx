import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotels } from '../data/hotels';

const Hotels = () => {
  const navigate = useNavigate();
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
