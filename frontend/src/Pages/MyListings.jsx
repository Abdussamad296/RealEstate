import React, { useState, useEffect } from "react";
import { getUserListings, deleteListing } from "../Service/list.service";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000"; // Adjust port/domain as needed

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [furnishedOnly, setFurnishedOnly] = useState(false);

  // Fetch user listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await getUserListings();
        setListings(response.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch listings.");
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Handle edit button click
  const handleEdit = (listing) => {
    navigate("/create-listing", { state: { listing } });
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    setError("");
    setSuccess("");
    try {
      await deleteListing(id);
      setSuccess("Listing deleted successfully!");
      const response = await getUserListings();
      setListings(response.data || []);
    } catch (err) {
      setError("Failed to delete listing.");
      console.error("Error deleting listing:", err);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Your Listings 📝
      </h2>
      {success && (
        <p className="text-green-500 text-center mb-4 font-medium">{success}</p>
      )}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* 🔍 Search Bar (Reduced width) */}
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-60 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-900 text-sm font-medium"
        />

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Types</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>

        {/* Furnished Filter */}
        <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={furnishedOnly}
            onChange={(e) => setFurnishedOnly(e.target.checked)}
            className="accent-green-700 w-4 h-4"
          />
          Furnished Only
        </label>

        {/* Sort Options */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 font-medium animate-pulse">
          Loading listings...
        </p>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings
            .filter(
              (listing) =>
                listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                listing.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((listing) =>
              filterType === "all" ? true : listing.type === filterType
            )
            .filter((listing) => (furnishedOnly ? listing.furnished : true))
            .sort((a, b) => {
              if (sortOption === "priceLowToHigh") {
                return (
                  (a.discountedPrice || a.regularPrice) -
                  (b.discountedPrice || b.regularPrice)
                );
              } else if (sortOption === "priceHighToLow") {
                return (
                  (b.discountedPrice || b.regularPrice) -
                  (a.discountedPrice || a.regularPrice)
                );
              }
              return 0;
            })
            .map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-56">
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
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col gap-3">
                  <h3
                    className="text-sm font-bold text-gray-800 truncate"
                    title={listing.name}
                  >
                    {listing.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 font-medium">
                    {listing.description}
                  </p>
                  <p className="text-gray-700 text-sm font-medium flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">{listing.address}</span>
                  </p>

                  {/* Amenities and Details */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-11">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 2a3 3 0 00-3 3v2a1 1 0 001 1h4a1 1 0 001-1V5a3 3 0 00-3-3zM4 9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
                        </svg>
                        <span className="font-medium text-sm">
                          {listing.bedrooms} Beds
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {listing.bathrooms} Baths
                        </span>
                      </div>
                    </div>
                    {listing.furnished && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h8v2H6v-2z" />
                        </svg>
                        <span className="font-medium text-sm">Furnished</span>
                      </div>
                    )}
                    {listing.parking && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0H6v12h6V4zm-2 5h2v2h-2V9z" />
                        </svg>
                        <span className="font-medium text-sm">Parking</span>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        {listing.offer ? "Discounted Price" : "Price"}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        $
                        {listing.offer
                          ? listing.discountedPrice.toLocaleString()
                          : listing.regularPrice.toLocaleString()}
                      </span>
                    </div>
                    {listing.offer && (
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-600">
                          Original Price
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${listing.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-600 mt-1">
                          Save $
                          {(
                            listing.regularPrice - listing.discountedPrice
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="px-4 py-1.5 bg-yellow-500 text-white font-medium text-lg rounded-full hover:bg-yellow-600 transition duration-200 flex items-center gap-2"
                      title="Edit this listing"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="px-4 py-1.5 bg-red-500 text-white text-lg font-medium rounded-full hover:bg-red-600 transition duration-200 flex items-center gap-2"
                      title="Delete this listing"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 font-medium">
          No listings found. Create one above!
        </p>
      )}
    </div>
  );
};

export default MyListings;
