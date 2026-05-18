import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

const RoomCard = ({ room, hotelId }) => {
  const { calculateNights } = useSearch();
  const nights = calculateNights();
  const totalPrice = room.price * nights;

  return (
    <div className="card p-5 flex flex-col md:flex-row gap-6">
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-display text-xl font-semibold text-accent-navy">{room.type}</h4>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Up to {room.maxGuests} guests
              </span>
              <span>{room.beds}</span>
              <span>{room.size}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent-navy">${room.price}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {room.features.map(feature => (
            <span
              key={feature}
              className="text-xs bg-primary-50 text-primary-900 px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Total for {nights} night{nights > 1 ? 's' : ''}: </span>
            <span className="font-bold text-lg text-accent-navy">${totalPrice}</span>
          </div>
          <Link
            to={`/booking/${hotelId}/${room.id}`}
            className="btn-gold"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
