import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const getDefaultDates = () => {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 1);
  const checkOut = new Date(today);
  checkOut.setDate(today.getDate() + 3);
  
  return {
    checkIn: checkIn.toISOString().split('T')[0],
    checkOut: checkOut.toISOString().split('T')[0]
  };
};

export const SearchProvider = ({ children }) => {
  const defaultDates = getDefaultDates();
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    guests: 2
  });

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    amenities: []
  });

  const updateSearchParams = (params) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      amenities: []
    });
  };

  const calculateNights = () => {
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        filters,
        updateSearchParams,
        updateFilters,
        resetFilters,
        calculateNights
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
