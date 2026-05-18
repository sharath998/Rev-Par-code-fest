import React from 'react';
import { Link } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? 'text-accent-gold'
              : i === fullStars && hasHalf
              ? 'text-accent-gold'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  );
};

const HotelCard = ({ hotel, variant = 'default' }) => {
  const { id, name, location, pricePerNight, rating, thumbnail, reviewCount } = hotel;

  if (variant === 'featured') {
    return (
      <Link to={`/hotel/${id}`} className="group">
        <div className="card overflow-hidden">
          <div className="relative h-64 overflow-hidden">
            <img
              src={thumbnail}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-accent-navy">${pricePerNight}</span>
              <span className="text-xs text-gray-500">/night</span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold text-accent-navy group-hover:text-accent-gold transition-colors">
              {name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{location}</p>
            <div className="flex items-center justify-between mt-3">
              <StarRating rating={rating} />
              <span className="text-xs text-gray-400">{reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card overflow-hidden flex flex-col md:flex-row">
      <div className="relative md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-xl font-semibold text-accent-navy">
                {name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{location}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent-navy">${pricePerNight}</span>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          </div>
          <div className="flex items-center mt-3">
            <StarRating rating={rating} />
            <span className="ml-2 text-xs text-gray-400">({reviewCount} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {hotel.amenities.slice(0, 4).map(amenity => (
              <span key={amenity} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to={`/hotel/${id}`}
            className="btn-primary inline-block text-center w-full md:w-auto"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
