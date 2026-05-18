import React, { useState } from 'react';

const ImageGallery = ({ images, hotelName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
        {/* Main Image */}
        <div
          className="md:col-span-3 relative rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={images[activeIndex]}
            alt={`${hotelName} - Image ${activeIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="hidden md:flex flex-col gap-4">
          {images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg overflow-hidden cursor-pointer flex-1 ${
                activeIndex === idx ? 'ring-2 ring-accent-gold' : ''
              }`}
              onClick={() => setActiveIndex(idx)}
            >
              <img
                src={img}
                alt={`${hotelName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {images.length > 3 && (
            <div
              className="relative rounded-lg overflow-hidden cursor-pointer flex-1"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[3]}
                alt={`${hotelName} more images`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 3} more</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={handlePrev}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={images[activeIndex]}
            alt={`${hotelName} - Image ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />

          <button
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={handleNext}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeIndex === idx ? 'bg-white' : 'bg-white/40'
                }`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
