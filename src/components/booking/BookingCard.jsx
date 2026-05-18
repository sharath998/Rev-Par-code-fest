import React from 'react';

const BookingCard = ({ booking, onCancel }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isBooked = booking.status === 'Booked';

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
          <img
            src={booking.hotel.thumbnail}
            alt={booking.hotel.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-xl font-semibold text-accent-navy">
                {booking.hotel.name}
              </h3>
              <p className="text-gray-500 text-sm">{booking.hotel.location}</p>
            </div>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${isBooked 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }
            `}>
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Booking ID</p>
              <p className="font-medium text-sm">{booking.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Check-in</p>
              <p className="font-medium text-sm">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Check-out</p>
              <p className="font-medium text-sm">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Room</p>
              <p className="font-medium text-sm">{booking.room.type}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Total: </span>
              <span className="font-bold text-lg text-accent-navy">${booking.totalPrice}</span>
            </div>
            {isBooked && (
              <button
                onClick={() => onCancel(booking.id)}
                className="btn-secondary text-sm py-2"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
