import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import HotelCard from '../components/hotel/HotelCard';
import { getFeaturedHotels, featuredDestinations } from '../data/hotels';

const Home = () => {
  const featuredHotels = getFeaturedHotels();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-center text-white mb-8 md:mb-12">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-balance">
              Discover Your Perfect Stay
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Experience luxury and comfort at world-class hotels and resorts
            </p>
          </div>

          <div className="max-w-5xl mx-auto w-full">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Popular Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most sought-after destinations around the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredDestinations.map(dest => (
              <Link
                key={dest.id}
                to={`/hotels?location=${encodeURIComponent(dest.name)}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                  <p className="text-sm text-gray-300">{dest.hotelCount} hotels</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title mb-4">Featured Hotels</h2>
              <p className="text-gray-600">
                Hand-picked luxury accommodations for discerning travelers
              </p>
            </div>
            <Link
              to="/hotels"
              className="hidden md:inline-flex items-center text-accent-gold font-medium hover:underline"
            >
              View All Hotels
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.slice(0, 6).map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} variant="featured" />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/hotels" className="btn-secondary">
              View All Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose RevPar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium booking service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Best Price Guarantee',
                description: 'Find a lower price? We\'ll match it and give you an additional 10% off.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: 'Premium Selection',
                description: 'Curated collection of the world\'s finest hotels and resorts.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: '24/7 Concierge',
                description: 'Round-the-clock support to ensure your perfect stay.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent-navy">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-accent-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust RevPar for their luxury accommodations.
          </p>
          <Link to="/hotels" className="btn-gold inline-block">
            Explore Hotels
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
