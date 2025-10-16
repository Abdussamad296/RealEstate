import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getListingById } from "../Service/list.service";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { sendEmail } from "../Service/email.service";
const BACKEND_URL = "http://localhost:3000";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const [userId, setUserId] = useState(currentUser ? currentUser._id : null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await getListingById(id);
        console.log("Fetched listing data:", response);
        setListing(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch listing details.");
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleContactSeller = () => {
    setIsModalOpen(true);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

const handleSendMessage = async () => {
  if (!message.trim()) {
    toast.error("Message cannot be empty.");
    return;
  }

  setSending(true);
  try {
    console.log("listing in send message:", listing);
    await sendEmail({
      to: listing.userEmail,
      subject: `Inquiry about ${listing.name}`,
      message: message,
    });
    toast.success("Message sent to the seller!");
    setMessage("");
    setIsModalOpen(false);
  } catch (err) {
    console.error("Axios error:", err.response || err);
    toast.error("Failed to send message.");
  } finally {
    setSending(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 font-medium animate-pulse">
          Loading listing...
        </p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-red-500 text-center font-medium">
          {error || "Listing not found."}
        </p>
        <Link
          to="/"
          className="block text-center mt-4 text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 className="text-3xl md:text-4xl font-bold">{listing.name}</h1>
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                listing.type === "rent" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </span>
          </div>

          {/* Image Gallery */}
          <div className="p-6">
            {listing.images && listing.images.length > 0 ? (
              <div className="relative">
                <img
                  src={`${BACKEND_URL}${listing.images[currentImageIndex]}`}
                  alt={listing.name}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                    e.target.alt = "Placeholder image";
                  }}
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                      aria-label="Previous image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                      aria-label="Next image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500 font-medium">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 grid md:grid-cols-2 gap-8">
            {/* Left Column: Key Details */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Price
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    $
                    {listing.offer
                      ? listing.discountedPrice.toLocaleString()
                      : listing.regularPrice.toLocaleString()}
                  </span>
                  {listing.offer && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through">
                        ${listing.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Save $
                        {(
                          listing.regularPrice - listing.discountedPrice
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Address
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
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
                  {listing.address}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Features
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a3 3 0 00-3 3v2a1 1 0 001 1h4a1 1 0 001-1V5a3 3 0 00-3-3zM4 9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
                    </svg>
                    <span>{listing.bedrooms} Beds</span>
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
                    <span>{listing.bathrooms} Baths</span>
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
                      <span>Furnished</span>
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
                      <span>Parking</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Description and Actions */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{listing.description}</p>
              </div>
              {userId && userId !== listing.userId && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleContactSeller}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
              <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Write your message..."
                value={message}
                onChange={handleMessageChange}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="block text-center mt-6 text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ListingDetails;
