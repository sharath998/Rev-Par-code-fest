import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { amenitiesList } from '../../data/hotels';

const Filters = ({ onClose, isMobile = false }) => {
  const { filters, updateFilters, resetFilters } = useSearch();

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilters({ amenities: newAmenities });
  };

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4.5, label: '4.5+ Excellent' },
    { value: 4, label: '4+ Very Good' },
    { value: 3.5, label: '3.5+ Good' }
  ];

  return (
    <div className={`bg-white rounded-xl ${isMobile ? '' : 'shadow-card'} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-semibold text-accent-navy">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-accent-gold hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Price per night</h4>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: parseInt(e.target.value) || 0 })}
              className="input-field text-sm"
              placeholder="$0"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) || 5000 })}
              className="input-field text-sm"
              placeholder="$5000"
            />
          </div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) })}
            className="w-full accent-accent-gold"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>${filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Guest Rating</h4>
        <div className="space-y-2">
          {ratingOptions.map(option => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === option.value}
                onChange={() => updateFilters({ minRating: option.value })}
                className="w-4 h-4 text-accent-gold focus:ring-accent-gold"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Amenities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 text-accent-gold rounded focus:ring-accent-gold"
              />
              <span className="ml-3 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="btn-primary w-full mt-4"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};

export default Filters;
