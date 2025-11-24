import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaBell,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { io as ClientIO } from "socket.io-client";
import axios from "axios";

// Define navigation links for cleaner rendering
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user) || {
    currentUser: null,
  };
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = ClientIO(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket", newSocket.id);
      // register userId with server so server knows which socket to emit to
      newSocket.emit("registerUser", currentUser._id);
    });

    newSocket.on("disconnect", () => console.log("Socket Disconnnected"));

    newSocket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  const fetchDropdownNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/notifications/get-notifications",
        { withCredentials: true }
      );
      setNotifications(res.data.notifications);
      setShowAll(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/notifications/all-notifications?page=${page}&limit=10`,
        { withCredentials: true }
      );

      setNotifications(res.data.notifications);
      setShowAll(true);
    } catch (err) {
      console.log(err);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/notifications/mark-as-read/${id}`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/notifications/read-all-notifications",
        {},
        { withCredentials: true }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDropdownNotifications();
  }, [currentUser]);

  useEffect(() => {
    if (showAll) {
      fetchAllNotifications();
    }
  }, [showAll, page]);

  // Effect to handle search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("q") || "";
    setSearchQuery(searchTermFromUrl);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/?q=${encodeURIComponent(trimmedQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Header is now fixed to the desired color
  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 bg-[#1F4B43] shadow-lg`;

  // Search form is fixed to a transparent/light style that works on the dark green
  const searchFormClasses = `hidden sm:flex px-3 py-2 rounded-full items-center border border-white/30 transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-400 max-w-xs bg-white/10`;

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 h-full">
        {/* Logo - Skyline with white color and yellow accent icon */}
        <Link to="/" className="flex items-center">
          <div className="text-white text-2xl font-extrabold tracking-wider">
            <span className="flex items-center">
              {/* Skyline Icon Placeholder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 20h6M9 10h6"
                />
              </svg>
              <span className="text-white">Skyline</span>
            </span>
          </div>
        </Link>

        {/* Search Form (Desktop) */}
        <form
          onSubmit={handleSearch}
          className={searchFormClasses}
          role="search"
        >
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Ensure input text is white on the dark search bar
            className="outline-none bg-transparent text-white w-40 sm:w-64 placeholder-gray-300"
            aria-label="Search property listings"
          />
          <button type="submit" aria-label="Submit Search">
            <FaSearch className="text-gray-300 hover:text-yellow-400" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-8 text-white font-medium tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-yellow-400 transition duration-150`}
            >
              {link.name}
            </Link>
          ))}

          {/* Sign Up Link (only if not logged in) */}
          {!currentUser && (
            <Link
              to="/sign-up"
              className={`hover:text-yellow-400 transition duration-150`}
            >
              Sign Up
            </Link>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="notification-bell relative text-white hover:text-yellow-400 focus:outline-none transition-colors"
            >
              <FaBell size={22} />
              {/* Red badge with animation */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Modern Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#1F4B43] to-[#2d6b5f] p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <p className="text-xs text-yellow-300 mt-0.5">
                          {unreadCount} unread{" "}
                          {unreadCount === 1 ? "notification" : "notifications"}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        unreadCount > 0
                          ? "bg-yellow-400 text-[#1F4B43] hover:bg-yellow-300 shadow-md"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                      title="Mark all as read"
                    >
                      <FaCheckDouble size={12} />
                      Mark All Read
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                {notifications.length > 0 ? (
                  <div
                    className={`overflow-y-auto custom-scrollbar transition-all duration-300 ${
                      showAll ? "max-h-[400px]" : "max-h-80"
                    }`}
                  >
                    {notifications.map((notif, index) => (
                      <div
                        key={notif._id}
                        className={`group relative p-3 border-b border-gray-100 cursor-pointer transition-all duration-200
    ${
      !notif.isRead
        ? "bg-blue-50 hover:bg-blue-100"
        : "bg-white hover:bg-gray-50"
    }
    ${index === notifications.length - 1 ? "border-b-0" : ""}
  `}
                        onClick={() => markRead(notif._id)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <img
                            src={
                              notif.sender?.img ||
                              "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                            alt="sender"
                          />

                          <div className="flex-1">
                            {/* Body Text */}
                            <p className="text-sm text-gray-800 leading-snug">
                              {notif.body}
                            </p>

                            {/* Time + Unread Dot */}
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] text-gray-500">
                                {timeAgo(notif.createdAt)}
                              </span>

                              {!notif.isRead && (
                                <span className="ml-2 bg-blue-500 w-2 h-2 rounded-full animate-pulse"></span>
                              )}
                            </div>
                          </div>

                          {/* Read check icon */}
                          {notif.isRead && (
                            <FaCheck className="text-green-500 text-xs mt-1" />
                          )}
                        </div>

                        {/* Hover animation border */}
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-[#1F4B43] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaBell className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      No notifications yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      We'll notify you when something arrives
                    </p>
                  </div>
                )}

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="bg-gray-50 p-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowAll(true)}
                      className="block w-full text-center text-[#1F4B43] hover:text-[#2d6b5f] text-sm font-semibold py-1"
                    >
                      View All Notifications →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile/Sign In Link */}
          <Link to="/dashboard" className="flex items-center">
            {currentUser ? (
              <img
                src={
                  currentUser.img ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                }
                alt={`${currentUser.name || "User"}'s Profile`}
                className={`w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-yellow-400 transition duration-150`}
              />
            ) : (
              <span className={`text-yellow-500 font-bold hover:underline`}>
                Sign In
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Toggle - White Icon */}
        <button
          className="sm:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav"
          // Mobile menu background is set to the same fixed color
          className={`sm:hidden bg-[#1F4B43] border-t border-green-800 absolute w-full top-20`}
        >
          {/* Mobile Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex p-4 border-b border-green-800"
          >
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow outline-none bg-green-800 text-white p-2 rounded-l-md placeholder-gray-400"
              aria-label="Search property listings"
            />
            {/* Search button uses the accent color */}
            <button
              type="submit"
              className="bg-yellow-500 text-green-900 font-bold p-3 rounded-r-md"
              aria-label="Submit Search"
            >
              <FaSearch />
            </button>
          </form>

          <ul className="flex flex-col items-center space-y-4 py-4 font-medium text-white">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={toggleMobileMenu}
                  className={`block w-full text-center py-1 hover:text-yellow-400`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Sign Up Link (only if not logged in) */}
            {!currentUser && (
              <li>
                <Link
                  to="/sign-up"
                  onClick={toggleMobileMenu}
                  className={`block w-full text-center py-1 hover:text-yellow-400`}
                >
                  Sign Up
                </Link>
              </li>
            )}

            {/* Profile/Sign In Link - Consolidated */}
            <li>
              <Link to="/dashboard" onClick={toggleMobileMenu}>
                {currentUser ? (
                  <img
                    src={
                      currentUser.img ||
                      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    }
                    alt={`${currentUser.name || "User"}'s Profile`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500 mt-2"
                  />
                ) : (
                  // Sign In button uses the yellow accent color
                  <span className="bg-yellow-500 text-green-900 font-bold px-6 py-2 rounded-full mt-2 inline-block shadow-md">
                    Sign In
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </header>
  );
};

export default Header;
