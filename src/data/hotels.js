export const hotels = [
  {
    id: 9,
    name: "ITC Kohinoor",
    location: "Hyderabad, India",
    address: "Plot No. 5, Hitech City Main Road, Madhapur, Hyderabad, Telangana 500081, India",
    description: "ITC Kohinoor is a luxury hotel set in the heart of Hyderabad's HITEC City, inspired by the legendary Kohinoor diamond. Featuring stunning contemporary architecture, world-class dining, an award-winning spa, and the iconic Sapphire rooftop bar, it blends Nizami heritage with modern indulgence in true ITC tradition.",
    rating: 4.8,
    reviewCount: 2156,
    pricePerNight: 320,
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipP4WC38myuablrr_7zQwdQtetsjx_xDgBQsxwbR=s1360-w1360-h1020-rw",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800",
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
    ],
    thumbnail: "https://lh3.googleusercontent.com/p/AF1QipP4WC38myuablrr_7zQwdQtetsjx_xDgBQsxwbR=s400-w400-h300-rw",
    amenities: ["Free WiFi", "Rooftop Bar", "Luxury Spa", "Fitness Center", "Multi-Cuisine Restaurants", "Outdoor Pool", "Concierge", "Valet Parking", "Business Center", "Airport Shuttle"],
    featured: true,
    rooms: [
      { id: 901, type: "Executive Club Room", price: 320, maxGuests: 2, beds: "1 King Bed", size: "420 sq ft", features: ["City View", "Club Lounge Access", "Complimentary Breakfast"] },
      { id: 902, type: "Kohinoor Suite", price: 580, maxGuests: 3, beds: "1 King Bed + Sofa", size: "780 sq ft", features: ["Skyline View", "Separate Living Room", "Butler Service"] },
      { id: 903, type: "Presidential Suite", price: 1450, maxGuests: 4, beds: "2 King Beds", size: "1800 sq ft", features: ["Panoramic City Views", "Private Dining", "Personal Butler", "Jacuzzi"] }
    ]
  },
  {
    id: 1,
    name: "The Ritz-Carlton New York",
    location: "New York, NY",
    address: "50 Central Park South, New York, NY 10019",
    description: "Experience the epitome of luxury at The Ritz-Carlton New York, Central Park. Overlooking the iconic Central Park, this legendary hotel offers unparalleled service, exquisite dining, and world-class amenities in the heart of Manhattan.",
    rating: 4.9,
    reviewCount: 2847,
    pricePerNight: 895,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    amenities: ["Free WiFi", "Spa", "Fitness Center", "Restaurant", "Bar", "Room Service", "Concierge", "Valet Parking", "Business Center", "Pool"],
    featured: true,
    rooms: [
      { id: 101, type: "Deluxe King Room", price: 895, maxGuests: 2, beds: "1 King Bed", size: "450 sq ft", features: ["City View", "Marble Bathroom", "Mini Bar"] },
      { id: 102, type: "Park View Suite", price: 1295, maxGuests: 3, beds: "1 King Bed + Sofa", size: "700 sq ft", features: ["Central Park View", "Living Area", "Premium Amenities"] },
      { id: 103, type: "Presidential Suite", price: 2500, maxGuests: 4, beds: "2 King Beds", size: "1500 sq ft", features: ["Panoramic Views", "Private Terrace", "Butler Service"] }
    ]
  },
  {
    id: 2,
    name: "Four Seasons Resort Maui",
    location: "Wailea, HI",
    address: "3900 Wailea Alanui Drive, Wailea, HI 96753",
    description: "Nestled along the pristine shores of Wailea Beach, Four Seasons Resort Maui offers an unforgettable Hawaiian escape with stunning ocean views, world-class spa treatments, and exceptional culinary experiences.",
    rating: 4.8,
    reviewCount: 1923,
    pricePerNight: 1200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    amenities: ["Beach Access", "Multiple Pools", "Spa", "Golf Course", "Water Sports", "Kids Club", "Fine Dining", "Tennis Courts"],
    featured: true,
    rooms: [
      { id: 201, type: "Garden View Room", price: 1200, maxGuests: 2, beds: "1 King Bed", size: "600 sq ft", features: ["Garden View", "Private Lanai", "Soaking Tub"] },
      { id: 202, type: "Ocean View Suite", price: 1800, maxGuests: 3, beds: "1 King Bed + Sofa", size: "900 sq ft", features: ["Ocean View", "Separate Living", "Premium Bar"] },
      { id: 203, type: "Beachfront Villa", price: 3500, maxGuests: 6, beds: "3 King Beds", size: "2200 sq ft", features: ["Direct Beach Access", "Private Pool", "Full Kitchen"] }
    ]
  },
  {
    id: 3,
    name: "The Peninsula Beverly Hills",
    location: "Beverly Hills, CA",
    address: "9882 S Santa Monica Blvd, Beverly Hills, CA 90212",
    description: "A legendary retreat in the heart of Beverly Hills, The Peninsula offers sophisticated luxury, impeccable service, and a serene garden oasis just steps from Rodeo Drive.",
    rating: 4.9,
    reviewCount: 1567,
    pricePerNight: 750,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
    amenities: ["Rooftop Pool", "Spa", "Fitness Center", "Restaurant", "Rolls-Royce Service", "Garden Terrace", "Business Center"],
    featured: true,
    rooms: [
      { id: 301, type: "Superior Room", price: 750, maxGuests: 2, beds: "1 King Bed", size: "400 sq ft", features: ["City View", "Marble Bath", "Work Desk"] },
      { id: 302, type: "Grand Suite", price: 1400, maxGuests: 3, beds: "1 King Bed + Sofa", size: "800 sq ft", features: ["Garden View", "Living Room", "Dining Area"] },
      { id: 303, type: "Villa Suite", price: 2800, maxGuests: 4, beds: "2 King Beds", size: "1800 sq ft", features: ["Private Garden", "Fireplace", "Full Kitchen"] }
    ]
  },
  {
    id: 4,
    name: "Waldorf Astoria Chicago",
    location: "Chicago, IL",
    address: "11 E Walton St, Chicago, IL 60611",
    description: "Rising above the Magnificent Mile, Waldorf Astoria Chicago combines Art Deco elegance with contemporary luxury, offering breathtaking views of Lake Michigan and the city skyline.",
    rating: 4.7,
    reviewCount: 1234,
    pricePerNight: 550,
    images: [
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1587213811864-46e59f6873b1?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400",
    amenities: ["Indoor Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "Room Service", "Concierge", "Pet Friendly"],
    featured: false,
    rooms: [
      { id: 401, type: "Deluxe Room", price: 550, maxGuests: 2, beds: "1 King Bed", size: "500 sq ft", features: ["City View", "Rain Shower", "Nespresso"] },
      { id: 402, type: "Lake View Suite", price: 900, maxGuests: 3, beds: "1 King Bed + Sofa", size: "750 sq ft", features: ["Lake View", "Sitting Area", "Wet Bar"] },
      { id: 403, type: "Penthouse Suite", price: 2200, maxGuests: 4, beds: "2 King Beds", size: "1600 sq ft", features: ["360° Views", "Private Terrace", "Dining Room"] }
    ]
  },
  {
    id: 5,
    name: "Montage Laguna Beach",
    location: "Laguna Beach, CA",
    address: "30801 S Coast Hwy, Laguna Beach, CA 92651",
    description: "Perched on a coastal bluff overlooking the Pacific Ocean, Montage Laguna Beach offers a quintessential Southern California experience with pristine beaches, world-class spa, and stunning ocean vistas.",
    rating: 4.8,
    reviewCount: 2156,
    pricePerNight: 950,
    images: [
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400",
    amenities: ["Beach Access", "Pool", "Spa", "Multiple Restaurants", "Tennis", "Kids Programs", "Art Collection", "Yoga Classes"],
    featured: true,
    rooms: [
      { id: 501, type: "Ocean View Room", price: 950, maxGuests: 2, beds: "1 King Bed", size: "550 sq ft", features: ["Ocean View", "Balcony", "Fireplace"] },
      { id: 502, type: "Oceanfront Suite", price: 1600, maxGuests: 3, beds: "1 King Bed + Daybed", size: "850 sq ft", features: ["Oceanfront", "Living Area", "Deep Tub"] },
      { id: 503, type: "Beach Bungalow", price: 2800, maxGuests: 4, beds: "2 Queen Beds", size: "1200 sq ft", features: ["Beach Access", "Patio", "Outdoor Shower"] }
    ]
  },
  {
    id: 6,
    name: "The St. Regis Aspen",
    location: "Aspen, CO",
    address: "315 E Dean St, Aspen, CO 81611",
    description: "At the base of Aspen Mountain, The St. Regis Aspen Resort offers an unparalleled mountain retreat with ski-in/ski-out access, world-class dining, and legendary St. Regis butler service.",
    rating: 4.9,
    reviewCount: 1876,
    pricePerNight: 1100,
    images: [
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=400",
    amenities: ["Ski-in/Ski-out", "Spa", "Heated Pool", "Fine Dining", "Butler Service", "Ski Valet", "Fitness Center", "Fire Pit"],
    featured: false,
    rooms: [
      { id: 601, type: "Mountain View Room", price: 1100, maxGuests: 2, beds: "1 King Bed", size: "480 sq ft", features: ["Mountain View", "Fireplace", "Heated Floors"] },
      { id: 602, type: "Aspen Suite", price: 1800, maxGuests: 3, beds: "1 King Bed + Sofa", size: "900 sq ft", features: ["Panoramic Views", "Wet Bar", "Sitting Area"] },
      { id: 603, type: "Residence Suite", price: 3200, maxGuests: 6, beds: "3 King Beds", size: "2000 sq ft", features: ["Private Deck", "Full Kitchen", "Multiple Fireplaces"] }
    ]
  },
  {
    id: 8,
    name: "Belmond Hotel Splendido",
    location: "Portofino, Italy",
    address: "Salita Baratta 16, 16034 Portofino, Italy",
    description: "A former monastery transformed into a legendary retreat, Belmond Hotel Splendido offers breathtaking views of the Italian Riviera, Mediterranean cuisine, and timeless Italian elegance.",
    rating: 4.8,
    reviewCount: 987,
    pricePerNight: 1650,
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    thumbnail: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
    amenities: ["Sea View Pool", "Spa", "Private Beach", "Fine Dining", "Boat Excursions", "Tennis", "Gardens", "Cooking Classes"],
    featured: false,
    rooms: [
      { id: 801, type: "Superior Double", price: 1650, maxGuests: 2, beds: "1 King Bed", size: "350 sq ft", features: ["Garden View", "Terrace", "Italian Linens"] },
      { id: 802, type: "Sea View Suite", price: 2400, maxGuests: 3, beds: "1 King Bed + Daybed", size: "600 sq ft", features: ["Sea View", "Living Area", "Private Balcony"] },
      { id: 803, type: "Splendido Suite", price: 4200, maxGuests: 4, beds: "2 King Beds", size: "1100 sq ft", features: ["Panoramic Views", "Multiple Terraces", "Butler Service"] }
    ]
  },
];

export const featuredDestinations = [
  { id: 1, name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", hotelCount: 245 },
  { id: 2, name: "Miami", image: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400", hotelCount: 178 },
  { id: 3, name: "Los Angeles", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400", hotelCount: 312 },
  { id: 4, name: "Chicago", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400", hotelCount: 156 },
  { id: 5, name: "Hawaii", image: "https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=400", hotelCount: 89 },
  { id: 6, name: "Aspen", image: "https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?w=400", hotelCount: 45 }
];

export const amenitiesList = [
  "Free WiFi",
  "Pool",
  "Spa",
  "Fitness Center",
  "Restaurant",
  "Bar",
  "Room Service",
  "Concierge",
  "Parking",
  "Pet Friendly",
  "Beach Access",
  "Business Center"
];

export const getHotelById = (id) => {
  return hotels.find(hotel => hotel.id === parseInt(id));
};

export const getFeaturedHotels = () => {
  return hotels.filter(hotel => hotel.featured);
};

export const searchHotels = (filters) => {
  let results = [...hotels];
  
  if (filters.location) {
    const searchTerm = filters.location.toLowerCase();
    results = results.filter(hotel => 
      hotel.location.toLowerCase().includes(searchTerm) ||
      hotel.name.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.minPrice) {
    results = results.filter(hotel => hotel.pricePerNight >= filters.minPrice);
  }
  
  if (filters.maxPrice) {
    results = results.filter(hotel => hotel.pricePerNight <= filters.maxPrice);
  }
  
  if (filters.minRating) {
    results = results.filter(hotel => hotel.rating >= filters.minRating);
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter(hotel => 
      filters.amenities.every(amenity => hotel.amenities.includes(amenity))
    );
  }
  
  return results;
};
