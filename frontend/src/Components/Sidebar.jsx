import React, { useState } from "react";
import {
  FaHome,
  FaPlusCircle,
  FaUser,
  FaEnvelope,
  FaHeart,
  FaSignOutAlt,
  FaThList,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Create Listing", icon: <FaPlusCircle />, path: "/create-listing" },
    { name: "My Listings", icon: <FaThList />, path: "/my-listings" },
    { name: "Messages", icon: <FaEnvelope />, path: "/messages" },
    { name: "Saved Properties", icon: <FaHeart />, path: "/saved" },
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/sign-in" },
  ];

  return (
    <div
      className={`relative h-screen flex flex-col transition-all duration-300 shadow-lg mt-6
        ${isOpen ? "w-64" : "w-20"}
        bg-slate-900 text-white`}
    >
      {/* Sidebar Toggle Button */}
      <button
        className={`absolute top-16 -right-3 w-8 h-8 bg-white text-[#1F4B43] rounded-full shadow-md flex items-center justify-center hover:bg-[#] transition-all duration-200 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Logo / Brand */}
      <div className="flex items-center justify-center mt-16 mb-4">
        <h1
          className={`text-2xl font-bold text-white tracking-wide transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Skyline
        </h1>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-x-4 p-3 rounded-md font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-gray-200 hover:bg-slate-700 hover:text-white"
                  }`}
                title={!isOpen ? item.name : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span
                  className={`whitespace-nowrap transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div
        className={`text-xs text-gray-300 mt-auto mb-8 text-center transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        © {new Date().getFullYear()} Skyline Realty
      </div>
    </div>
  );
};

export default Sidebar;
