import React from 'react';

const HotelCardSkeleton = () => {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

const DetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export { HotelCardSkeleton, DetailsSkeleton };
