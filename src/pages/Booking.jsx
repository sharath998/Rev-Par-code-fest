import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BookingForm from '../components/booking/BookingForm';
import { useBooking } from '../context/BookingContext';
import { useSearch } from '../context/SearchContext';
import { getHotelById } from '../data/hotels';

const Booking = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBooking();
  const { searchParams, calculateNights } = useSearch();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hotelData = getHotelById(hotelId);
    if (hotelData) {
      setHotel(hotelData);
      const roomData = hotelData.rooms.find(r => r.id === parseInt(roomId));
      setRoom(roomData);
    }
    setLoading(false);
  }, [hotelId, roomId]);

  const handleSubmit = (guestDetails) => {
    const nights = calculateNights();
    const booking = addBooking({
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        thumbnail: hotel.thumbnail
      },
      room: {
        id: room.id,
        type: room.type,
        price: room.price
      },
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      guestDetails,
      nights,
      totalPrice: room.price * nights
    });

    toast.success('Booking confirmed!');
    navigate(`/confirmation/${booking.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Booking information not found
        </h1>
        <Link to="/hotels" className="btn-primary">
          Browse Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-accent-navy">Home</Link>
          <span>/</span>
          <Link to={`/hotel/${hotel.id}`} className="hover:text-accent-navy">{hotel.name}</Link>
          <span>/</span>
          <span className="text-accent-navy">Booking</span>
        </nav>

        <h1 className="font-display text-3xl font-bold text-accent-navy mb-8">
          Complete Your Booking
        </h1>

        {/* Hotel Summary */}
        <div className="card p-4 mb-6 flex gap-4">
          <img
            src={hotel.thumbnail}
            alt={hotel.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="font-display text-lg font-semibold text-accent-navy">
              {hotel.name}
            </h2>
            <p className="text-sm text-gray-500">{hotel.location}</p>
            <p className="text-sm font-medium mt-1">{room.type}</p>
          </div>
        </div>

        <BookingForm
          room={room}
          hotel={hotel}
          searchParams={searchParams}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Booking;
