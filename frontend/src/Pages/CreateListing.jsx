import React, { useState, useEffect } from "react";
import { createListing, getUserListings, updateListing, deleteListing } from "../Service/list.service";

// Replace with your backend base URL (e.g., from env vars)
const BACKEND_URL = "http://localhost:3000"; // Adjust port/domain as needed

const CreateListing = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    furnished: false,
    offer: false,
    parking: false,
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await getUserListings();
        setListings(response.data || []);
      } catch (err) {
        setError(err.response.data.msg);
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, type: inputType, checked, files, name } = e.target;
    const key = name || id;
    if (inputType === "checkbox") {
      setFormData({ ...formData, [key]: checked });
    } else if (inputType === "file") {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const newFiles = Array.from(files)
        .filter((file) => validTypes.includes(file.type))
        .slice(0, 6 - formData.images.length - existingImages.length);
      if (newFiles.length < files.length) {
        setError("Only JPG, JPEG, and PNG files are allowed.");
      }
      setFormData({ ...formData, images: [...formData.images, ...newFiles] });
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  // Handle new image deletion
  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Handle existing image deletion
  const handleDeleteExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Handle edit button click
  const handleEdit = (listing) => {
    setIsEditing(true);
    setCurrentId(listing._id);
    setFormData({
      name: listing.name,
      description: listing.description,
      address: listing.address,
      type: listing.type,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      regularPrice: listing.regularPrice,
      discountedPrice: listing.discountedPrice || 0,
      furnished: listing.furnished,
      offer: listing.offer,
      parking: listing.parking,
      images: [],
    });
    setExistingImages(listing.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const totalImages = formData.images.length + existingImages.length;
    if (!formData.name || !formData.description || !formData.address) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    if (totalImages === 0) {
      setError("Please upload at least one image.");
      setIsSubmitting(false);
      return;
    }
    if (formData.offer) {
      if (formData.discountedPrice <= 0 || formData.discountedPrice >= formData.regularPrice) {
        setError("Discounted price must be greater than 0 and less than regular price.");
        setIsSubmitting(false);
        return;
      }
    } else {
      formData.discountedPrice = 0;
    }

    try {
      let response;
      if (isEditing) {
        response = await updateListing(currentId, { ...formData, existingImages });
      } else {
        response = await createListing(formData);
      }
      setSuccess(`Listing ${isEditing ? "updated" : "created"} successfully!`);
      setFormData({
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        furnished: false,
        offer: false,
        parking: false,
        images: [],
      });
      setExistingImages([]);
      setIsEditing(false);
      setCurrentId(null);
      const listingsResponse = await getUserListings();
      setListings(listingsResponse.data || []);
      console.log("Success:", response);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.msg ||
        error.response?.data?.message ||
        error.message ||
        `Failed to ${isEditing ? "update" : "create"} listing.`;
      setError(errorMsg);
      console.error("Error details:", error.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto font-sans bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          {isEditing ? "Edit Listing ✏️" : "Create a Listing 🏡"}
        </h1>

        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4 font-medium">{success}</p>}

        <form className="grid md:grid-cols-2 gap-10" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Left Column - Form Inputs */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Listing Name"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none h-40"
                required
              />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rent"
                  name="type"
                  value="rent"
                  checked={formData.type === "rent"}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="rent" className="text-gray-700">Rent</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sale"
                  name="type"
                  value="sale"
                  checked={formData.type === "sale"}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="sale" className="text-gray-700">Sale</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="furnished" className="text-gray-700">Furnished</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="parking" className="text-gray-700">Parking</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  name="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="offer" className="text-gray-700">Offer</label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">Regular Price ($)</label>
                <input
                  type="number"
                  id="regularPrice"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleChange}
                  min={1}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">Discounted Price ($)</label>
                <input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  min={0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.offer}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Images (Max 6 total)</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleChange}
                multiple
                accept=".jpg,.jpeg,.png"
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={formData.images.length + existingImages.length >= 6}
                required={existingImages.length + formData.images.length === 0}
              />
            </div>

            {/* Existing Images */}
            {isEditing && existingImages.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${BACKEND_URL}${url}`}
                        alt={`Existing ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-lg shadow-md transition duration-300 hover:scale-105"
                        onError={(e) => {
                          console.error("Image load error:", url);
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Delete image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Uploaded Images */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Uploaded Images</label>
              <div className="flex flex-wrap gap-4">
                {formData.images.length > 0 ? (
                  formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-lg shadow-md transition duration-300 hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Delete image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No new images uploaded yet.</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full p-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Listing" : "Create Listing")}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Your Listings 📝</h2>
        {loading ? (
          <p className="text-center text-gray-500 font-medium animate-pulse">Loading listings...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
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
                        e.target.src = "https://via.placeholder.com/400x224?text=No+Image";
                        e.target.alt = "Placeholder image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-xl">
                      <span className="text-gray-500 font-medium">No Image Available</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      listing.type === "rent" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-gray-800 truncate" title={listing.name}>
                    {listing.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                  <p className="text-gray-700 font-medium flex items-center gap-2">
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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

                  {/* Price Section */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        {listing.offer ? "Discounted Price" : "Price"}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${listing.offer ? listing.discountedPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                      </span>
                    </div>
                    {listing.offer && (
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-600">Original Price</span>
                        <span className="text-lg text-gray-500 line-through">
                          ${listing.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-600 mt-1">
                          Save ${(listing.regularPrice - listing.discountedPrice).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center gap-2"
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
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-2"
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
          <p className="text-center text-gray-400 font-medium">No listings found. Create one above!</p>
        )}
      </div>
    </main>
  );
};

export default CreateListing;