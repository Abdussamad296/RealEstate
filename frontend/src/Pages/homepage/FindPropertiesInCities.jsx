import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const BACKEND_URL = "http://localhost:3000";

const FindPropertiesInCities = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/home/cities`);
        setCities(res.data || []);
      } catch (err) {
        console.error("Failed to load cities:", err);
      }
    };
    fetchCities();
  }, []);

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
        className="pb-16"
      >
        {cities.map((city, idx) => (
          <SwiperSlide key={idx}>
            <div className="rounded-xl overflow-hidden shadow-lg group bg-white cursor-pointer duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={city.image ? `${BACKEND_URL}${city.image}` : "https://via.placeholder.com/400x224?text=No+Image"}
                  alt={city.name}
                  className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4 flex flex-row items-center justify-between">
                <span className="text-xl font-bold text-gray-900">{city.name}</span>
                <span className="text-md text-gray-600 mt-1">
                  {city.propertiesCount}+ properties
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FindPropertiesInCities;
