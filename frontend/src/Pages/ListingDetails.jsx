import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getListingById } from "../Service/list.service";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { sendEmail } from "../Service/email.service";
import axios from "axios";
import { useSocket } from "../context/SocketContext"; // Make sure path is correct

const BACKEND_URL = "http://localhost:3000";

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isSellerOnline, setIsSellerOnline] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id || null;
  const socket = useSocket();

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const response = await getListingById(id);
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

  // Online status check
  useEffect(() => {
    if (!socket || !listing?.userRef) return;

    const checkOnlineStatus = () => {
      socket.emit("getOnlineUsers");
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 10000); // Refresh every 10s

    const handleOnlineUsers = (onlineUserIds) => {
      const online = onlineUserIds.includes(listing.userRef);
      setIsSellerOnline(online);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      clearInterval(interval);
    };
  }, [socket, listing?.userRef]);

  // Image navigation
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

  const handleContactSeller = () => setIsModalOpen(true);
  const handleMessageChange = (e) => setMessage(e.target.value);

  // Clean send message — no socket emit here!
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    if (!listing || !userId) {
      toast.error("Invalid listing or user.");
      return;
    }

    const messageData = {
      listingId: id,
      buyerId: userId,
      sellerId: listing.userRef,
      message: message.trim(),
      sender: "buyer",
    };

    try {
      setSending(true);

      // 1. Save to DB first (this returns the full message with _id, createdAt)
      const saveRes = await axios.post(
        "http://localhost:3000/api/message/send",
        messageData,
        { withCredentials: true }
      );

      const savedMessage = saveRes.data;

      // 2. Emit via socket with consistent format
      if (socket) {
        socket.emit("sendChatMessage", savedMessage); 
      }

      // 3. Send email (optional, keep if needed)
      await sendEmail({
        to: listing.userEmail,
        subject: `New inquiry about ${listing.name}`,
        message: message.trim(),
      });

      // 4. Create booking (optional)
      await axios.post("http://localhost:3000/api/booking/create-booking", {
        name: currentUser.username,
        email: currentUser.email,
        message: message.trim(),
        action: listing.type,
        agentId: listing.userRef,
        buyerId: currentUser._id,
        propertyId: id,
        listingName: listing.name,
      });

      toast.success("Message sent! You can continue chatting in Messages.");
      setMessage("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Send message error:", err.response || err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin reverse"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">Not Found</div>
          <p className="text-red-400 text-xl font-semibold mb-4">
            {error || "Listing not found."}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-11">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors duration-300 mb-6 group text-lg"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
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
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          {/* Hero Image */}
          <div className="relative h-[60vh] overflow-hidden group">
            {listing.images?.length > 0 ? (
              <>
                <img
                  src={`${BACKEND_URL}${listing.images[currentImageIndex]}`}
                  alt={listing.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image")
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        {listing.name}
                      </h1>
                      <p className="text-purple-200 flex items-center gap-2 text-lg">
                        <svg
                          className="w-5 h-5"
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
                    <span
                      className={`px-6 py-2 rounded-full text-sm font-bold text-white backdrop-blur-md ${
                        listing.type === "rent"
                          ? "bg-blue-500/80"
                          : "bg-green-500/80"
                      } shadow-lg`}
                    >
                      {listing.type.charAt(0).toUpperCase() +
                        listing.type.slice(1)}
                    </span>
                  </div>
                </div>

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6"
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
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                      {listing.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentImageIndex
                              ? "bg-white w-8"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                <span className="text-white/50 text-xl font-medium">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Price, Features, Contact */}
              <div className="space-y-4">
                {/* Price */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                    Price
                  </p>
                  <div className="text-xl font-bold text-white">
                    $
                    {listing.offer
                      ? listing.discountedPrice.toLocaleString()
                      : listing.regularPrice.toLocaleString()}
                    {listing.type === "rent" && (
                      <span className="text-lg text-purple-300"> /month</span>
                    )}
                  </div>
                  {listing.offer && (
                    <div className="mt-2 flex items-center gap-5">
                      <span className="text-white/50 line-through text-lg">
                        ${listing.regularPrice.toLocaleString()}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-bold">
                        Save $
                        {(
                          listing.regularPrice - listing.discountedPrice
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                    Features
                  </h2>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 2a3 3 0 00-3 3v2a1 1 0 001 1h4a1 1 0 001-1V5a3 3 0 00-3-3zM4 9a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm">
                        {listing.bedrooms} Bedrooms
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-sm">
                        {listing.bathrooms} Bathrooms
                      </span>
                    </div>
                    {listing.furnished && (
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-pink-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h8v2H6v-2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-sm">Furnished</span>
                      </div>
                    )}
                    {listing.parking && (
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0H6v12h6V4zm-2 5h2v2h-2V9z" />
                          </svg>
                        </div>
                        <span className="font-medium text-sm">
                          Parking Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Online Status + Contact */}
                {userId && userId !== listing.userId && (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="relative">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            isSellerOnline ? "bg-green-400" : "bg-gray-600"
                          } shadow-lg`}
                        ></div>
                        {isSellerOnline && (
                          <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold text-lg ${
                            isSellerOnline ? "text-green-300" : "text-gray-400"
                          }`}
                        >
                          {isSellerOnline
                            ? "Seller is Online"
                            : "Seller is Offline"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {isSellerOnline
                            ? "Instant reply possible"
                            : "Will be notified when online"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleContactSeller}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact Seller
                    </button>
                  </>
                )}
              </div>

              {/* Right: Description */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    About This Property
                  </h2>
                  <p className="text-purple-100 leading-relaxed whitespace-pre-line text-sm font-semibold">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl w-full max-w-md border border-white/20 shadow-2xl">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Contact Seller
                </h2>
                <textarea
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-32"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={handleMessageChange}
                />
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-semibold border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all font-bold disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex-center transition-all border border-white/20"
              >
                <svg
                  className="w-5 h-5"
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
      </div>
    </div>
  );
};

export default ListingDetails;
