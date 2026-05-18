import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BookingContext = createContext();

const STORAGE_KEY = 'revpar_bookings';

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
    dispatch({ type: 'CANCEL_BOOKING', payload: bookingId });
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
