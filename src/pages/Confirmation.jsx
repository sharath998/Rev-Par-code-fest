import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const Confirmation = () => {
  const { bookingId } = useParams();
  const { getBookingById } = useBooking();
  const booking = getBookingById(bookingId);

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Booking not found
        </h1>
        <Link to="/my-bookings" className="btn-primary">
          View My Bookings
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-accent-navy mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your reservation has been successfully made
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <img
              src={booking.hotel.thumbnail}
              alt={booking.hotel.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h2 className="font-display text-xl font-semibold text-accent-navy">
                {booking.hotel.name}
              </h2>
              <p className="text-gray-500 text-sm">{booking.hotel.location}</p>
              <p className="text-sm font-medium mt-1">{booking.room.type}</p>
            </div>
          </div>

          <div className="py-6 border-b border-gray-200 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Reference</span>
              <span className="font-semibold">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in</span>
              <span className="font-medium">{formatDate(booking.checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out</span>
              <span className="font-medium">{formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Guest Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Name: </span>
                {booking.guestDetails.firstName} {booking.guestDetails.lastName}
              </p>
              <p>
                <span className="text-gray-500">Email: </span>
                {booking.guestDetails.email}
              </p>
              <p>
                <span className="text-gray-500">Phone: </span>
                {booking.guestDetails.phone}
              </p>
              {booking.guestDetails.specialRequests && (
                <p>
                  <span className="text-gray-500">Special Requests: </span>
                  {booking.guestDetails.specialRequests}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-accent-navy">
                ${booking.totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card p-6 bg-primary-50 border border-primary-200 mb-6">
          <h3 className="font-semibold text-accent-navy mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              A confirmation email has been sent to {booking.guestDetails.email}
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You can manage your booking from the My Bookings page
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Contact the hotel directly for special arrangements
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/my-bookings" className="btn-primary flex-1 text-center">
            View My Bookings
          </Link>
          <Link to="/" className="btn-secondary flex-1 text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
