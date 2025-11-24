// src/components/PropertyCard.jsx (or similar path)
import React from 'react';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
const BACKEND_URL = "http://localhost:3000";

const PropertyCard = ({ property }) => {
  const { name, address, regularPrice, bedrooms, bathrooms, type } = property;
  const image = `${BACKEND_URL}${property.images[0]}`;

  // Function to format price (e.g., $20,000)
  const formattedPrice = `$${regularPrice.toLocaleString()}`;

  // Determine tag color based on type
  const typeTagColor = type === 'rent' ? 'bg-indigo-500' : 'bg-teal-500';

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out">
      {/* Image and Type Tag */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-sm font-semibold text-white uppercase rounded-full ${typeTagColor}`}
        >
          {type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-[#1F4B43] truncate">{name}</h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-red-400" />
          <span className="truncate">{address}</span>
        </p>

        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          {/* Bed/Bath */}
          <div className="flex space-x-4 text-gray-600">
            <span className="flex items-center text-sm">
              <FaBed className="mr-1 text-sky-500" /> {bedrooms} Bed{bedrooms > 1 ? 's' : ''}
            </span>
            <span className="flex items-center text-sm">
              <FaBath className="mr-1 text-sky-500" /> {bathrooms} Bath{bathrooms > 1 ? 's' : ''}
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-gray-800">
            {formattedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;