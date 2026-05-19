import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getHotelById } from '../data/hotels';
import { useApp } from '../context/AppContext';

const BookingConfirmedModal = ({ booking, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
    <div className="w-full max-w-xl rounded-[28px] bg-white p-8 text-center shadow-2xl animate-fade-in">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="font-display text-4xl text-dark">Booking Confirmed</h2>
      <p className="mt-3 text-gray-600">
        Your stay is reserved. We have saved every detail exactly as selected.
      </p>

      <div className="mt-6 rounded-2xl bg-cream p-6 text-left">
        <h3 className="font-display text-2xl text-dark">{booking.hotel.name}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-gray-500">Check-in</p>
            <p className="font-semibold text-dark">
              {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Check-out</p>
            <p className="font-semibold text-dark">
              {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Room</p>
            <p className="font-semibold text-dark">{booking.room.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Rate</p>
            <p className="font-semibold text-gold">${booking.room.price}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-gold px-6 py-4 text-lg font-semibold text-white transition hover:bg-yellow-600"
      >
        Return to Overview
      </button>
    </div>
  </div>
);

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, canUserBook, addBooking, claimOffer } = useApp();
  
  const hotel = getHotelById(parseInt(id));
  const offer = location.state?.offer || null;
  const preselectedRoomType = location.state?.preselectedRoomType || offer?.roomType || '';
  const searchFilters = useMemo(
    () => location.state?.searchFilters || { checkIn: '', checkOut: '', guests: 1 },
    [location.state]
  );

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
  });
  const [bookingDates, setBookingDates] = useState({
    checkIn: searchFilters.checkIn || '',
    checkOut: searchFilters.checkOut || '',
  });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!hotel?.rooms?.length) return;
    const matchedRoom =
      hotel.rooms.find((room) => room.type === preselectedRoomType) || hotel.rooms[0];
    setSelectedRoom(matchedRoom);
  }, [hotel, preselectedRoomType]);

  useEffect(() => {
    if (searchFilters.checkIn && searchFilters.checkOut) {
      setBookingDates({
        checkIn: searchFilters.checkIn,
        checkOut: searchFilters.checkOut,
      });
    }
  }, [searchFilters]);

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-3xl text-dark">Hotel Not Found</h2>
      </div>
    );
  }

  const isOfferRoomSelected = Boolean(offer && selectedRoom?.type === offer.roomType);
  const bookingPrice = isOfferRoomSelected ? offer.discountedPrice : selectedRoom?.price;

  const handleBookNow = () => {
    if (!selectedRoom) {
      alert('Please select a room type');
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (!canUserBook(currentUser.id)) {
      alert('You already have an active booking. Cancel it first to make a new booking.');
      return;
    }

    const result = addBooking({
      userId: currentUser.id,
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        thumbnail: hotel.thumbnail,
      },
      room: {
        ...selectedRoom,
        price: bookingPrice,
        originalPrice: isOfferRoomSelected ? selectedRoom.price : undefined,
      },
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests: searchFilters.guests,
      guestDetails,
      isOfferBooking: isOfferRoomSelected,
      offerId: isOfferRoomSelected ? offer.id : null,
    });

    if (result.success) {
      if (isOfferRoomSelected) {
        claimOffer(offer.id, currentUser.id);
      }
      setConfirmedBooking(result.booking);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      {/* Hero Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src={hotel.images?.[0] || hotel.thumbnail}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {offer && (
        <div className="mb-8 rounded-[28px] border border-[#E7D8A9] bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A8A57]">Selected last-minute offer</p>
              <h2 className="font-display text-3xl text-dark">Your offer is ready to review</h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                We’ve preselected the original cancelled stay so you can explore the property before making a decision.
              </p>
            </div>
            <div className="rounded-2xl bg-[#2C2C2C] px-6 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">Offer rate</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="font-display text-4xl">${offer.discountedPrice}</span>
                <span className="pb-1 text-white/65">/ night</span>
              </div>
              <p className="text-sm text-white/55 line-through">${offer.originalPrice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Info */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl text-dark mb-2">
              {hotel.name}
            </h1>
            <p className="text-gray-600 text-lg">{hotel.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(hotel.rating)
                    ? 'text-gold fill-current'
                    : 'text-gray-300 fill-current'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-600 ml-2">{hotel.rating}</span>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          {hotel.description}
        </p>

        {/* Amenities */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-display text-xl text-dark mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hotel.amenities?.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
        <h3 className="font-display text-2xl text-dark mb-6">Select Room</h3>
        {offer && (
          <p className="mb-4 rounded-lg bg-gold/10 border border-gold/30 px-4 py-3 text-sm text-dark">
            <strong>Room Type Locked:</strong> This offer is valid only for <strong>{offer.roomType}</strong>
          </p>
        )}
        <div className="space-y-4">
          {hotel.rooms?.map((room, idx) => (
            <div
              key={idx}
              onClick={() => !offer && setSelectedRoom(room)}
              className={`border-2 rounded-xl p-6 transition ${
                offer ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${
                selectedRoom?.type === room.type
                  ? 'border-gold bg-gold/5'
                  : 'border-gray-200 hover:border-gold/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-dark mb-1">
                    {room.type}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Max {room.maxGuests} guests</span>
                    <span>•</span>
                    <span>{room.size}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Per Night</p>
                  {offer && offer.roomType === room.type ? (
                    <div>
                      <p className="text-3xl font-bold text-gold">${offer.discountedPrice}</p>
                      <p className="text-sm text-gray-400 line-through">${room.price}</p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-gold">${room.price}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <h3 className="font-display text-2xl text-dark mb-6">Guest Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            value={guestDetails.name}
            onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="email"
            placeholder="Email"
            value={guestDetails.email}
            onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
            <input
              type="date"
              value={bookingDates.checkIn}
              onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })}
              disabled={Boolean(offer)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold ${
                offer ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
            <input
              type="date"
              value={bookingDates.checkOut}
              onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })}
              disabled={Boolean(offer)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold ${
                offer ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={guestDetails.phone}
            onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold md:col-span-2"
          />
        </div>

        {offer && (
          <p className="mb-4 text-sm text-gray-500 bg-gold/5 border border-gold/30 rounded-lg p-3">
            <strong>Dates Locked:</strong> This offer is valid only for the original booking dates ({new Date(offer.checkIn).toLocaleDateString()} - {new Date(offer.checkOut).toLocaleDateString()})
          </p>
        )}

        <button
          onClick={handleBookNow}
          disabled={!selectedRoom || !bookingDates.checkIn || !bookingDates.checkOut}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
            selectedRoom && bookingDates.checkIn && bookingDates.checkOut
              ? 'bg-gold text-white hover:bg-yellow-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedRoom && bookingDates.checkIn && bookingDates.checkOut
            ? `Book Now - $${bookingPrice}`
            : 'Complete all fields to continue'}
        </button>
        {offer && (
          <p className="mt-3 text-center text-sm text-gray-500">
            The special rate is attached to <span className="font-semibold text-dark">{offer.roomType}</span>. Switching rooms returns you to the standard nightly rate.
          </p>
        )}
      </div>

      {confirmedBooking && (
        <BookingConfirmedModal
          booking={confirmedBooking}
          onClose={() => navigate('/overview')}
        />
      )}
    </div>
  );
};

export default HotelDetails;
