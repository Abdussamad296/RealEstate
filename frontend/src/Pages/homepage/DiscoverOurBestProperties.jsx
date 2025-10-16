import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
// Using the bundled CSS for cleaner integration of navigation/pagination styles
import "swiper/css/bundle";

// Import icons
import { FaLocationDot, FaDollarSign, FaBath } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { FaParking } from "react-icons/fa";
// Removed FaTag since the screenshot doesn't show a dedicated "OFFER" tag,
// but rather small tags like "FOR SALE" or "FEATURED".

// Static Data for the Carousel
const staticListings = [
  {
    _id: 1,
    name: "Luxury Downtown Condo",
    address: "123 Central Ave, City",
    image:
      "https://images.unsplash.com/photo-1560185008-5c48d98dfc06?auto=format&fit=crop&w=800&q=80",
    type: "rent", // Matches "FOR RENT" in screenshot
    regularPrice: 2500,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    offer: false,
    sizeSqFt: 450, // Added for the square footage shown in the screenshot
  },
  {
    _id: 2,
    name: "Spacious Family Home",
    address: "45 Oak Lane, Suburb",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    type: "sale", // Matches "FOR SALE" in screenshot
    regularPrice: 450000,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    offer: true,
    discountedPrice: 420000,
    sizeSqFt: 400,
  },
  {
    _id: 3,
    name: "Modern Studio Loft",
    address: "70 King St, Metro",
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
    type: "rent",
    regularPrice: 1500,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    offer: false,
    sizeSqFt: 280,
    isFeatured: true, // Added a featured flag for the tag in the screenshot
  },
  {
    _id: 4,
    name: "Rustic Lake House",
    address: "99 Shore Rd, Lakeside",
    image:
      "https://images.unsplash.com/photo-1600585154340-1eeb2f57fa2e?auto=format&fit=crop&w=800&q=80",
    type: "sale",
    regularPrice: 890000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    offer: false,
    sizeSqFt: 450,
  },
  {
    _id: 5,
    name: "City Penthouse",
    address: "50 Sky Tower, Downtown",
    image:
      "https://images.unsplash.com/photo-1600585154340-9c3be00dcf6e?auto=format&fit=crop&w=800&q=80",
    type: "sale",
    regularPrice: 1200000,
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    offer: true,
    discountedPrice: 1100000,
    sizeSqFt: 460,
    isFeatured: true,
  },
];

// Reusable formatting function
const formatPrice = (price, isRent) => {
  const formatted = price.toLocaleString();
  const suffix = isRent ? "/month" : ""; // Changed from /mo to /month for screenshot style
  return `$${formatted}${suffix}`;
};

const DiscoverOurBestProperties = () => {
  // Define custom colors to match the screenshot as closely as possible
  const PRIMARY_COLOR = "#1F4B43"; // Dark Green background
  const TEXT_COLOR = "#ffffff"; // White text for header
  const SUBTITLE_COLOR = "rgba(255, 255, 255, 0.6)"; // Faded white/gray for subtitle
  const ACCENT_COLOR = "#007AFF"; // A clean blue for the CTA button (approximating the screenshot's color)
  const CARD_BG = "#ffffff"; // White card background
  const DETAILS_BG = "#f8f8f8"; // Light gray/off-white for the specs/price section (to visually separate it)

  // Custom Swiper styles to match the minimalist look of the screenshot
  const customSwiperStyles = `
    .swiper-button-next, .swiper-button-prev {
      display: none !important; /* Screenshot does not show arrows, only dots */
    }

    /* Style for the pagination dots - small black/dark gray dots */
    .swiper-pagination-bullet {
      background: rgba(0, 0, 0, 0.4) !important;
      opacity: 1 !important;
      width: 8px;
      height: 8px;
      margin: 0 4px !important;
    }

    /* Style for the active pagination dot - small white dot with black border/shadow (approximated here as white) */
    .swiper-pagination-bullet-active {
      background: ${TEXT_COLOR} !important;
    }
  `;

  // Function to render a single spec icon/value pair
  const SpecItem = ({ icon: Icon, value, label, isZeroAllowed = true }) => {
    if (!isZeroAllowed && value === 0) return null;
    return (
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="font-bold text-gray-800">{value}</span>
        <span className="text-gray-500 text-xs mr-3">{label}</span>
      </div>
    );
  };

  return (
    <div className="py-12 max-w-6xl mx-auto">
      {/* Inject custom styles for Swiper pagination */}
      <style>{customSwiperStyles}</style>

      <div className={`bg-[${PRIMARY_COLOR}] p-6 sm:p-8 rounded-xl`}>
        {/* Header and CTA Section */}
        <div className="flex justify-between items-start px-2 sm:px-4 flex-wrap gap-y-4 mb-10">
          <div className="max-w-xl">
            <h1 className={`text-3xl sm:text-4xl font-semibold text-[${TEXT_COLOR}] mb-1`}>
              Discover Our Best Deals
            </h1>
            {/* Replaced old paragraph with simple subtitle as seen in screenshot */}
            <p className={`text-sm text-[${SUBTITLE_COLOR}] font-light`}>
              Lorem ipsum dolor sit amet
            </p>
          </div>
          {/* Button style updated to match the screenshot's look: blue background, white text */}
          <button className={`px-5 py-2.5 bg-white text-[${ACCENT_COLOR}] font-bold text-sm rounded-lg hover:bg-gray-100 transition duration-200 shadow-md whitespace-nowrap border-2 border-[${ACCENT_COLOR}]`}>
            View All Properties
          </button>
        </div>

        {/* Swiper Carousel Section */}
        <div className="px-2 sm:px-4">
          <Swiper
            modules={[Pagination]} // Removed Navigation module
            spaceBetween={24}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-12" // Add padding bottom for pagination dots
          >
            {staticListings.map((listing) => {
              const isRent = listing.type === "rent";
              const price = listing.offer ? listing.discountedPrice : listing.regularPrice;

              return (
                <SwiperSlide key={listing._id}>
                  {/* Card container - White body, no excessive shadow/hover effect to match screenshot */}
                  <div className={`rounded-lg overflow-hidden bg-[${CARD_BG}]`}>
                    {/* Image Section */}
                    <div className="relative h-48">
                      <img
                        src={listing.image}
                        alt={`Image of ${listing.name}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Top Corner Tags: "FOR SALE" / "FOR RENT" and "FEATURED" */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {/* Type Tag */}
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md ${
                            isRent ? "bg-red-500" : "bg-green-600" // Used colors approximating the screenshot's tags
                          }`}
                        >
                          FOR {listing.type.toUpperCase()}
                        </span>
                        
                        {/* Featured Tag (if property has isFeatured flag) */}
                        {listing.isFeatured && (
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 bg-yellow-400 shadow-md`}>
                             FEATURED
                           </span>
                        )}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-3">
                      {/* Name */}
                      <h2
                        className="text-lg font-bold text-gray-900 truncate mb-1"
                        title={listing.name}
                      >
                        {listing.name}
                      </h2>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
                        <FaLocationDot className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <p className="truncate">{listing.address}</p>
                      </div>
                    </div>
                    
                    {/* Specs and Price Footer - Darker background as implied by the screenshot */}
                    <div className={`px-3 py-3 flex justify-between items-center bg-[${DETAILS_BG}]`}>
                        {/* Specs */}
                        <div className="flex items-center divide-x divide-gray-300 text-sm">
                            <SpecItem icon={IoBedOutline} value={listing.bedrooms} label="" />
                            <div className="pl-3">
                                <SpecItem icon={FaBath} value={listing.bathrooms} label="" />
                            </div>
                            <div className="pl-3">
                                <SpecItem icon={FaParking} value={listing.parking} label="" isZeroAllowed={true} />
                            </div>
                            {/* Added size as seen in the screenshot */}
                             <div className="pl-3 text-gray-500 font-bold">
                                 {listing.sizeSqFt || '-'}
                            </div>
                        </div>

                        {/* Price */}
                        <p className={`font-extrabold text-sm flex-shrink-0 ${isRent ? 'text-red-500' : 'text-green-600'}`}>
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
    </div>
  );
};

export default DiscoverOurBestProperties;