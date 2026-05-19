import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateLastMinuteOffer } from '../services/offerGenerator';

const BookingContext = createContext();

const STORAGE_KEY = 'revpar_bookings';
const OFFERS_STORAGE_KEY = 'revpar_last_minute_offers';

const getStoredBookings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  bookings: getStoredBookings(),
  currentBooking: null,
  loading: false
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
        currentBooking: action.payload
      };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload
            ? { ...booking, status: 'Cancelled' }
            : booking
        )
      };
    case 'SET_CURRENT_BOOKING':
      return {
        ...state,
        currentBooking: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        currentBooking: null
      };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
  }, [state.bookings]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BK${Date.now()}`,
      status: 'Booked',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    // Get the booking before cancelling
    const booking = state.bookings.find(b => b.id === bookingId);
    
    // Cancel in state
    dispatch({ type: 'CANCEL_BOOKING', payload: bookingId });
    
    // Check if eligible for last-minute offer (within 24h of check-in)
    if (booking) {
      const offer = generateLastMinuteOffer(booking);
      if (offer) {
        // Save to separate localStorage for admin dashboard
        try {
          const existing = JSON.parse(localStorage.getItem(OFFERS_STORAGE_KEY) || '[]');
          localStorage.setItem(
            OFFERS_STORAGE_KEY,
            JSON.stringify([offer, ...existing])
          );
        } catch (e) {
          console.error('Failed to save last-minute offer:', e);
        }
      }
    }
  };

  const getBookingById = (id) => {
    return state.bookings.find(booking => booking.id === id);
  };

  const setCurrentBooking = (booking) => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  const clearCurrentBooking = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings: state.bookings,
        currentBooking: state.currentBooking,
        loading: state.loading,
        addBooking,
        cancelBooking,
        getBookingById,
        setCurrentBooking,
        clearCurrentBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
