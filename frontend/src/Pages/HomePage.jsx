import React, { useState, useEffect, useRef } from "react";
import { getRecentListings } from "../Service/list.service";
import homeImage from "../assets/Real_estate_Home_img.jpg";
import { FaArrowRightLong, FaLocationDot } from "react-icons/fa6";
import { FaBath, FaDollarSign } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import FindPropertiesInCities from "./homepage/FindPropertiesInCities";
import DiscoverOurBestProperties from "./homepage/DiscoverOurBestProperties";
import PerfectHome from "./homepage/PerfectHome";
import ReviewProperties from "./homepage/ReviewProperties";
import Footer from "./homepage/Footer";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [activeFilter, setActiveFilter] = useState("All Properties");

  const filterData = ["All Properties", "Rent", "Sale"];
  const location = useLocation();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const featuredRef = useRef(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await getRecentListings();
        setListings(response.data || []);
      } catch (err) {
        setError("Failed to fetch recent listings.");
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const q = urlParams.get("q") || "";
    const type = urlParams.get("type") || "all";

    setSearchQuery(q);
    setSearchType(type);
    if (q) {
      const delayDebounce = setTimeout(() => {
        fetchSearchResults(q, type);
      }, 600);
      return () => clearTimeout(delayDebounce);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    if (searchType !== "all") {
      params.set("type", searchType);
    }
    navigate(`/?${params.toString()}`);
  };

  const fetchSearchResults = async (query, type = "all") => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/home/search?q=${query}`;
      if (type !== "all") url += `&type=${type}`;
      const response = await axios.get(url);
      setListings(response.data || []);
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const filteredListings =
    activeFilter === "All Properties"
      ? listings
      : listings.filter(
          (listing) => listing.type.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div className="font-sans bg-gray-100">
      {/* Hero Section */}
      <section
        ref={searchRef}
        className="relative bg-cover bg-center h-screen text-white flex items-center justify-center "
      >
        <img
          src={homeImage}
          alt="Beautiful house"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-3xl text-center px-4 backdrop-blur-xs rounded-xl p-6 bg-white/40">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1F4B43]">
            Find Your Dream Home
          </h1>
          <p className="text-lg font-semibold md:text-xl mb-8 text-green-950">
            Discover the best properties for rent or sale in your area.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="text"
              placeholder="Enter city, address, or zip code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 p-3 rounded-full text-gray-900 outline-none border border-[#1F4B43]"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 rounded-full text-[#1F4B43] outline-none border border-[#1F4B43]"
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1F4B43] text-white font-semibold rounded-full hover:bg-green-950 transition duration-200 outline"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section
        className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        ref={featuredRef}
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          Featured Properties 🏡
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Explore our hand-picked featured properties offering the best homes
          for rent and sale in prime locations.
        </p>

        <div className="flex justify-center mb-6">
          {filterData.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`mx-2 px-4 py-2 rounded-full transition duration-200 cursor-pointer border border-gray-600 ${
                activeFilter === item
                  ? "bg-green-950 text-white"
                  : "bg-green-900 text-gray-200 hover:bg-green-950"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 font-medium animate-pulse">
            Loading listings...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="relative h-72">
                  {listing.images[0] ? (
                    <img
                      src={`${BACKEND_URL}${listing.images[0]}`}
                      alt={listing.name}
                      className="w-full h-full object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x224?text=No+Image";
                        e.target.alt = "Placeholder image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-xl">
                      <span className="text-gray-500 font-medium">
                        No Image Available
                      </span>
                    </div>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      listing.type === "rent" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {listing.type.charAt(0).toUpperCase() +
                      listing.type.slice(1)}
                  </span>
                  <div className="absolute bottom-4 w-[90%] bg-white/90 backdrop-blur-md p-4 rounded-xl mx-5">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {listing.name}
                    </h3>

                    {/* Address */}
                    <p className="flex items-center text-sm text-gray-600 mt-1 truncate">
                      <FaLocationDot className="mr-1 text-blue-600" />
                      {listing.address}
                    </p>

                    {/* Details Row */}
                    <div className="flex justify-between items-center mt-3 text-gray-700 text-sm">
                      <span className="flex items-center gap-1">
                        <FaDollarSign className="text-green-600" />
                        {listing.regularPrice}
                      </span>
                      <span className="flex items-center gap-1">
                        <IoBedOutline className="text-indigo-600" />
                        {listing.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBath className="text-blue-500" />
                        {listing.bathrooms} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <BiSolidOffer className="text-red-500" />
                        {listing.offer ? listing.discountedPrice : "No Offer"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 font-medium">
            No listings available. Check back soon!
          </p>
        )}
        <button className="mt-8 mx-auto flex items-center px-6 py-3 bg-green-900 text-white font-semibold rounded-full hover:bg-green-950 transition duration-200 outline">
          See All Listings
          <FaArrowRightLong className="ml-2" />
        </button>
      </section>

      {/* Find Properties in These Cities */}
      <FindPropertiesInCities />

      {/* About Section */}
      <section className="py-16 bg-[#E7C873] rounded-lg ml-8 mr-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4  gap-8">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-black mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0L3.937 4.03A1 1 0 003 5v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-.937-.97l-5.669-1.95zM10 4.5l5.5 1.897V14H4.5V6.397L10 4.5zM7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-600">
                Browse a variety of properties for rent or sale.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-black-600 mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Trusted Platform
              </h3>
              <p className="text-gray-600">
                Secure and reliable transactions with verified listings.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-black-600 mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Community Focus
              </h3>
              <p className="text-gray-600">
                Connect with local sellers and buyers easily.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-black mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0L3.937 4.03A1 1 0 003 5v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-.937-.97l-5.669-1.95zM10 4.5l5.5 1.897V14H4.5V6.397L10 4.5zM7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-600">
                Browse a variety of properties for rent or sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DiscoverOurBestProperties />

      <PerfectHome searchRef={searchRef} featuredRef={featuredRef} />

      <ReviewProperties />

      {/* CTA Section */}
      <Footer />
    </div>
  );
};

export default HomePage;
