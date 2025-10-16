// src/components/RecentActivity.jsx (SIMPLIFIED)
import React from 'react';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';

const RecentActivity = ({ property }) => {
  const { name, address, price, bedrooms, bathrooms, type, image } = property;

  const formattedPrice = `$${price.toLocaleString()}`;
  const typeTagColor = type === 'rent' ? 'text-indigo-600' : 'text-green-600';


  return (
    // Horizontal layout container
    <div className="flex bg-white rounded-xl shadow-xl overflow-hidden 
                    border border-gray-100 hover:shadow-2xl transition duration-300">
      {/* 1. Compact Image (Left Side) */}
      <div className="flex-shrink-0 w-24 h-24 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Small Type Label Overlay */}
        <span
          className={`absolute bottom-0 left-0 text-xs font-bold text-white px-1 py-0.5 uppercase ${type === 'rent' ? 'bg-indigo-600' : 'bg-green-600'}`}
        >
          {type === 'rent' ? 'Rent' : 'Sale'}
        </span>
      </div>

      {/* 2. Details (Right Side) */}
      <div className="flex flex-col justify-center p-3 flex-grow">
        <p className={`text-lg mb-1 truncate ${typeTagColor}`}>{name}</p>
        
        {/* Price and Location */}
        <p className="text-sm font-extrabold text-[#1F4B43]">{formattedPrice}</p>
        <p className="text-xs text-gray-500 flex items-center mt-1 truncate">
          <FaMapMarkerAlt className="mr-1 text-red-400 flex-shrink-0" />
          {address}
        </p>
      </div>

    </div>
  );
};

export default RecentActivity;