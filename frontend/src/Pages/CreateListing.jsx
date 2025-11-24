import React, { useState, useEffect } from "react";
import { createListing, updateListing } from "../Service/list.service";
import { useNavigate, useLocation } from "react-router-dom";

// Replace with your backend base URL (e.g., from env vars)
const BACKEND_URL = "http://localhost:3000"; // Adjust port/domain as needed

const CreateListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Check if editing a listing (passed via location.state)
  useEffect(() => {
    if (location.state?.listing) {
      const listing = location.state.listing;
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
    }
  }, [location.state]);

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
      navigate("/my-listings"); // Redirect to MyListings after success
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
    <main className="p-4 max-w-7xl mx-auto font-sans mt-10">
      <div className="p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
          {isEditing ? "Edit Listing ✏️" : "Create a Listing 🏡"}
        </h1>

        {success && <p className="text-green-500 text-center mb-4 font-medium">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

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
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                required
              />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none h-40 text-sm"
                required
              />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="rent"
                  name="type"
                  value="rent"
                  checked={formData.type === "rent"}
                  onChange={handleChange}
                  className="accent-blue-600 w-3 h-3"
                />
                <label htmlFor="rent" className="text-gray-700 text-sm">Rent</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sale"
                  name="type"
                  value="sale"
                  checked={formData.type === "sale"}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="sale" className="text-gray-700 text-sm">Sale</label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="furnished" className="text-gray-700 text-sm">Furnished</label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="parking"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="parking" className="text-gray-700 text-sm">Parking</label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="offer"
                  name="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="offer" className="text-gray-700 text-sm">Offer</label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="regularPrice" className="block text-sm font-semibold text-gray-700 mb-1">Regular Price ($)</label>
                <input
                  type="number"
                  id="regularPrice"
                  name="regularPrice"
                  value={formData.regularPrice}
                  onChange={handleChange}
                  min={1}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="discountedPrice" className="block text-sm font-semibold text-gray-700 mb-1">Discounted Price ($)</label>
                <input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  min={0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={!formData.offer}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload New Images (Max 6 total)</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleChange}
                multiple
                accept=".jpg,.jpeg,.png"
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Uploaded Images</label>
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
                  <p className="text-gray-400 italic text-sm">No new images uploaded yet.</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full p-3 bg-[#1F4B43] text-white font-bold rounded-full shadow-lg hover:bg-green-950 transition duration-200 ease-in-out text-lg cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Listing" : "Create Listing")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;