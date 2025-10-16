import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const cities = [
  {
    name: "New York",
    properties: "1200+ properties",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Los Angeles",
    properties: "950+ properties",
    img: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chicago",
    properties: "800+ properties",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Miami",
    properties: "600+ properties",
    img: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "San Francisco",
    properties: "700+ properties",
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
  },
];

const FindPropertiesInCities = () => {
  return (
    <div className="py-12 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-4">
        Find Properties in These Cities
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Discover the most popular properties in top cities, offering the perfect blend of comfort and convenience.
      </p>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-16" // space for pagination dots
      >
        {cities.map((city, idx) => (
          <SwiperSlide key={idx}>
            <div className="rounded-xl overflow-hidden shadow-lg group bg-white cursor-pointer duration-300">
              <div className="relative overflow-hidden">
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-300" 
                  />
              </div>

              <div className="p-4 flex flex-row items-center justify-between">
                <span className="text-xl font-bold text-gray-900">{city.name}</span>
                <span className="text-md text-gray-600 mt-1">{city.properties}</span>
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FindPropertiesInCities;