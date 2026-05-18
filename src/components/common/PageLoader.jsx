import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
