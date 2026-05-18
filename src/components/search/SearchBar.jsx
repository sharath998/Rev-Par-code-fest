import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const SearchBar = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const { searchParams, updateSearchParams } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/hotels');
  };

  const isHero = variant === 'hero';

  return (
    <form onSubmit={handleSubmit}>
      <div className={`
        ${isHero 
          ? 'bg-white rounded-2xl shadow-elevated p-6 md:p-8' 
          : 'bg-white rounded-xl shadow-card p-4'
        }
      `}>
        <div className={`
          grid gap-4
          ${isHero 
            ? 'md:grid-cols-4 lg:grid-cols-5' 
            : 'md:grid-cols-5'
          }
        `}>
          {/* Location */}
          <div className={isHero ? 'md:col-span-2 lg:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchParams.location}
                onChange={(e) => updateSearchParams({ location: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => updateSearchParams({ checkIn: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => updateSearchParams({ checkOut: e.target.value })}
              min={searchParams.checkIn}
              className="input-field"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <select
              value={searchParams.guests}
              onChange={(e) => updateSearchParams({ guests: parseInt(e.target.value) })}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className={`flex items-end ${isHero ? 'md:col-span-4 lg:col-span-1' : ''}`}>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
