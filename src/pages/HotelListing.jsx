import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/hotel/HotelCard';
import SearchBar from '../components/search/SearchBar';
import Filters from '../components/search/Filters';
import { HotelCardSkeleton } from '../components/common/Skeleton';
import { useSearch } from '../context/SearchContext';
import { searchHotels } from '../data/hotels';

const HotelListing = () => {
  const [urlParams] = useSearchParams();
  const { searchParams, filters, updateSearchParams } = useSearch();
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const location = urlParams.get('location');
    if (location) {
      updateSearchParams({ location });
    }
  }, [urlParams]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [searchParams, filters]);

  const hotels = useMemo(() => {
    return searchHotels({
      location: searchParams.location,
      ...filters
    });
  }, [searchParams.location, filters]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-accent-navy">
              {searchParams.location
                ? `Hotels in ${searchParams.location}`
                : 'All Hotels'}
            </h1>
            <p className="text-gray-500 mt-1">
              {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            className="lg:hidden btn-secondary text-sm py-2 flex items-center gap-2"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <Filters />
            </div>
          </aside>

          {/* Hotel List */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="card p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="font-display text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Filters onClose={() => setMobileFiltersOpen(false)} isMobile />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelListing;
