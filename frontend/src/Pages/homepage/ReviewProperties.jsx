import React, { useEffect, useState } from "react";
// Import necessary icons
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { getAllUsers } from "../../Service/user.service";

// --- Static Data ---
const companyLogos = [
  // In a real app, these would be imported images or SVG components
  { id: 1, name: "Amazon", image: "/path/to/amazon-logo.svg" },
  { id: 2, name: "AMD", image: "/path/to/amd-logo.svg" },
  { id: 3, name: "CISCO", image: "/path/to/cisco-logo.svg" },
  { id: 4, name: "DROPCOM", image: "/path/to/dropcom-logo.svg" },
  { id: 5, name: "logitech", image: "/path/to/logitech-logo.svg" },
  { id: 6, name: "spotify", image: "/path/to/spotify-logo.svg" },
  { id: 7, name: "tesla", image: "/path/to/tesla-logo.svg" },
  { id: 8, name: "zoom", image: "/path/to/zoom-logo.svg" },
  { id: 9, name: "google", image: "/path/to/google-logo.svg" },
  { id: 10, name: "microsoft", image: "/path/to/microsoft-logo.svg" },
];

const testimonialData = {
  quote:
    "Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dores.",
  author: "John Doe",
  title: "Lead Designer at Acme Corp",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Placeholder avatar
};

const statsData = [
  { value: "10M+", label: "Active Users" },
  { value: "4.88", label: "Overall Rating", icon: true },
];

// --- Reusable Components ---

// Component for the Star Rating
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < fullStars ? "text-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }
  return <div className="flex items-center mt-1">{stars}</div>;
};

const ReviewProperties = () => {
  const [activeUser, setActiveUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getAllUsers();
        const allUser = user.data.length;
        setActiveUser(allUser);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  return (
    <div className="bg-[#FFF8F6] py-10  sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* --- 1. Header, Stats, and Testimonial Section --- */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-10">
          {/* Left Column: Header and Stats */}
          <div className="lg:w-1/2">
            <h1 className="text-xl md:text-3xl font-semibold text-gray-900 leading-tight mb-4">
              What our customers are saying us?
            </h1>
            <p className="text-md text-gray-600 mb-8 max-w-lg">
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose injected humour and the like.
            </p>

            {/* Stats Block */}
            <div className="flex gap-10 md:gap-16">
              <div className="flex flex-col items-start">
                <p className="text-2xl font-bold text-indigo-600">
                  {activeUser}+
                </p>
                <p className="text-base font-semibold text-gray-700 mt-1">
                  Active Users
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-2xl font-bold text-indigo-600">4.88</p>
                <p className="text-base font-semibold text-gray-700 mt-1">
                  Overall Rating
                </p>
                <StarRating rating={4.88} />
              </div>
            </div>
          </div>

          {/* Right Column: Single Testimonial */}
          <div className="lg:w-1/2 flex flex-col justify-between p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <FaQuoteLeft className="w-8 h-8 text-indigo-500 mb-6 flex-shrink-0" />

            {/* Quote Text */}
            <p className="text-lg italic text-gray-800 mb-8 leading-relaxed">
              {testimonialData.quote}
            </p>

            {/* Author Info and Navigation (Placeholder for Swiper/Carousel) */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <img
                  src={testimonialData.avatar}
                  alt={testimonialData.author}
                  className="w-8 h-8 rounded-full object-cover shadow-md"
                />
                <div>
                  <p className="font-bold text-gray-900">
                    {testimonialData.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonialData.title}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows (for conceptual swiper/carousel) */}
              <div className="flex gap-3">
                <button
                  className="p-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                  aria-label="Previous testimonial"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                <button
                  className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  aria-label="Next testimonial"
                >
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. Company Trust Logos Section --- */}
        <div className="pt-5 border-t border-gray-300">
          <p className="text-center text-xl font-semibold text-gray-600 mb-4">
            Thousands of world’s leading companies trust Space
          </p>

          {/* Logos Grid/Flex */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-12 md:gap-y-8">
            {companyLogos.map((logo) => (
              <div
                key={logo.id}
                className="h-10 w-24 md:w-32 flex items-center justify-center p-1 opacity-70 hover:opacity-100 transition duration-300"
              >
                {/* Placeholder div for the actual logo image/SVG */}
                <div className="text-xl font-bold text-gray-700 opacity-60">
                  {logo.name}
                </div>
                {/* In a real app, use:
                  <img 
                    src={logo.image} 
                    alt={`${logo.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                  /> 
                */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProperties;
