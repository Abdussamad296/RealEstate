import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { Bed, Bath, Car, Home, MapPin, Tag } from "lucide-react";

// --- SAMPLE DATA (as before) ---
const sampleProperties = [
  {
    _id: "68cd585127a987f069c05d5d",
    name: "Sunny 2-Bedroom Condo with City Views",
    description: "Discover urban living at its finest in this spacious and modern two-bedroom, two-bathroom condo. Located in a prime downtown area",
    address: "123 Urban Blvd, Metropolis, CA 90210",
    regularPrice: 20000,
    discountedPrice: 11,
    bedrooms: 2,
    bathrooms: 4,
    furnished: true,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d5e",
    name: "Modern Loft in Arts District",
    description: "High ceilings, exposed brick, and industrial charm. Perfect for creatives.",
    address: "456 Brick Lane, Artville, NY 10013",
    regularPrice: 3500,
    discountedPrice: 3200,
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    offer: true,
    parking: false,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d5f",
    name: "Luxury Penthouse with Ocean View",
    description: "Panoramic ocean views, private terrace, and premium finishes.",
    address: "789 Ocean Dr, Miami Beach, FL 33139",
    regularPrice: 15000,
    discountedPrice: 13500,
    bedrooms: 3,
    bathrooms: 3,
    furnished: true,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d60",
    name: "Cozy Studio Near Campus",
    description: "Affordable and convenient for students. Walk to university.",
    address: "321 College St, Berkeley, CA 94704",
    regularPrice: 1800,
    discountedPrice: 1800,
    bedrooms: 0,
    bathrooms: 1,
    furnished: true,
    offer: false,
    parking: false,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d61",
    name: "Family Home with Garden",
    description: "Spacious 4-bed home with backyard and garage. Family-friendly neighborhood.",
    address: "555 Green Ave, Suburbia, TX 75001",
    regularPrice: 4000,
    discountedPrice: 3800,
    bedrooms: 4,
    bathrooms: 3,
    furnished: false,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d62",
    name: "Downtown Micro Apartment",
    description: "Efficient 300 sqft studio. Smart design, great location.",
    address: "100 Center Sq, Chicago, IL 60601",
    regularPrice: 1400,
    discountedPrice: 1400,
    bedrooms: 0,
    bathrooms: 1,
    furnished: true,
    offer: false,
    parking: false,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d63",
    name: "Riverside Cottage",
    description: "Peaceful retreat with river access. Ideal for nature lovers.",
    address: "88 River Rd, Woodstock, VT 05091",
    regularPrice: 2800,
    discountedPrice: 2500,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d64",
    name: "Tech-Savvy Smart Home",
    description: "Fully automated with Alexa, Nest, and keyless entry.",
    address: "202 Tech Park, Austin, TX 78701",
    regularPrice: 5000,
    discountedPrice: 4700,
    bedrooms: 3,
    bathrooms: 2,
    furnished: true,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d65",
    name: "Beachfront Bungalow",
    description: "Steps from the sand. Private patio and outdoor shower.",
    address: "777 Wave St, Malibu, CA 90265",
    regularPrice: 8500,
    discountedPrice: 8500,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    offer: false,
    parking: true,
    type: "rent",
    images: [],
  },
  {
    _id: "68cd585127a987f069c05d66",
    name: "Mountain View Chalet",
    description: "Cozy wood interiors, fireplace, and ski-in access.",
    address: "111 Peak Dr, Aspen, CO 81611",
    regularPrice: 12000,
    discountedPrice: 11000,
    bedrooms: 4,
    bathrooms: 3,
    furnished: true,
    offer: true,
    parking: true,
    type: "rent",
    images: [],
  },
];

// --- PROPERTY CARD ---
const PropertyCard = ({ property }) => {
  const [saved, setSaved] = useState(false);

  // Load saved state from localStorage (and sync)
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    setSaved(savedList.includes(property._id));
  }, [property._id]);

  const toggleSave = () => {
    const savedList = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    let newSaved;
    if (saved) {
      newSaved = savedList.filter((id) => id !== property._id);
    } else {
      newSaved = [...savedList, property._id];
    }
    localStorage.setItem("savedProperties", JSON.stringify(newSaved));
    setSaved(!saved);
  };

  const imageUrl = property.images[0]
    ? property.images[0].startsWith("http")
      ? property.images[0]
      : `http://localhost:5000${property.images[0]}`
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={property.name}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x300/1F4B43/FFFFFF?text=${
                property.name.split(" ")[0]
              }`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-green-400 flex items-center justify-center">
            <Home className="w-14 h-14 text-white opacity-70" />
          </div>
        )}

        {/* Offer Badge */}
        {property.offer && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
            <Tag className="w-3 h-3" /> OFFER
          </div>
        )}

        {/* Save Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform"
        >
          <AnimatePresence>
            <motion.div
              key={saved ? "filled" : "empty"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaHeart
                className={`w-5 h-5 ${
                  saved ? "fill-red-500 text-red-500" : "fill-none text-gray-500"
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
          {property.name}
        </h3>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <p className="line-clamp-1">{property.address.split(",")[0]}</p>
        </div>

        {/* Price */}
        <div>
          {property.offer ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${property.discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${property.regularPrice.toLocaleString()}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                -
                {Math.round(
                  ((property.regularPrice - property.discountedPrice) /
                    property.regularPrice) *
                    100
                )}
                %
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${property.regularPrice.toLocaleString()}
            </span>
          )}
          <p className="text-xs text-gray-500">/month</p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          {property.parking && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span>Parking</span>
            </div>
          )}
          {property.furnished && (
            <div className="flex items-center gap-1 text-green-600">
              <Home className="w-4 h-4" />
              <span>Furnished</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- PROPERTY LIST ---
const PropertyList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Featured Rentals
          </h1>
          <p className="text-gray-600">
            Discover your perfect home from our curated listings
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sampleProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyList;
