import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";
import { FaLocationDot } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { FaBath, FaParking } from "react-icons/fa";
import axios from "axios";

const DiscoverOurBestProperties = () => {
  const [listings, setListings] = useState([]);
  const backendURL = "http://localhost:3000";

  useEffect(() => {
    // Fetch properties from backend
    const fetchBestDeals = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/home/best-deals")
        setListings(res.data.data || []);
      } catch (error) {
        console.error("Error fetching best deals:", error);
      }
    };
    fetchBestDeals();
  }, []);

  const formatPrice = (price, isRent) => {
    const formatted = price.toLocaleString();
    const suffix = isRent ? "/month" : "";
    return `$${formatted}${suffix}`;
  };

  const SpecItem = ({ icon: Icon, value }) => (
    <div className="flex items-center gap-1.5">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="py-12 max-w-6xl mx-auto">
      <div className="bg-[#1F4B43] p-6 sm:p-8 rounded-xl">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-1">
            Discover Our Best Deals
          </h1>
          <p className="text-sm text-white font-light">
            Don’t miss out on our top offers — your dream property might be just one click away!
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {listings.map((listing) => {
            const isRent = listing.type === "rent";
            const price = listing.offer
              ? listing.discountedPrice
              : listing.regularPrice;

            return (
              <SwiperSlide key={listing._id}>
                <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
                  <div className="relative h-48">
                    <img
                      src={listing.images && listing.images.length > 0
                        ? `${backendURL}${listing.images[0]}`
                        : "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md ${
                          isRent ? "bg-red-500" : "bg-green-600"
                        }`}
                      >
                        FOR {listing.type.toUpperCase()}
                      </span>
                      {listing.isFeatured && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 bg-yellow-400 shadow-md">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3">
                    <h2 className="text-lg font-bold text-gray-900 truncate mb-1">
                      {listing.name}
                    </h2>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
                      <FaLocationDot className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <p className="truncate">{listing.address}</p>
                    </div>
                  </div>

                  <div className="px-3 py-3 flex justify-between items-center bg-[#f8f8f8]">
                    <div className="flex items-center divide-x divide-gray-300 text-sm">
                      <SpecItem icon={IoBedOutline} value={listing.bedrooms} />
                      <div className="pl-3">
                        <SpecItem icon={FaBath} value={listing.bathrooms} />
                      </div>
                      <div className="pl-3">
                        <SpecItem icon={FaParking} value={listing.parking} />
                      </div>
                    </div>
                    <p
                      className={`font-extrabold text-sm ${
                        isRent ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {formatPrice(price, isRent)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default DiscoverOurBestProperties;
