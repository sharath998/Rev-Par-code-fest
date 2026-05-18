import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BookingCard from '../components/booking/BookingCard';
import { useBooking } from '../context/BookingContext';

const MyBookings = () => {
  const { bookings, cancelBooking } = useBooking();

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'Booked');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-accent-navy mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start exploring our luxury hotels and make your first booking
            </p>
            <Link to="/hotels" className="btn-primary inline-block">
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Bookings */}
            {activeBookings.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-accent-navy mb-4">
                  Upcoming Stays ({activeBookings.length})
                </h2>
                <div className="space-y-4">
                  {activeBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-gray-500 mb-4">
                  Cancelled ({cancelledBookings.length})
                </h2>
                <div className="space-y-4 opacity-75">
                  {cancelledBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
