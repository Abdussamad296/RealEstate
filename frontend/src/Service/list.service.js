import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const createListing = async (formData) => {
  try {
    const data = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) => {
          data.append("images", image);
        });
      } else {
        data.append(key, formData[key]);
      }
    }
    const response = await axios.post(`${API_BASE_URL}/listing/create-listing`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in createListing:", err);
    throw err;
  }
};

export const getUserListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/user-listings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in getUserListings:", err);
    throw err;
  }
};

export const updateListing = async (id, dataObj) => {
  try {
    const { existingImages, ...formData } = dataObj;
    const data = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) => {
          data.append("images", image);
        });
      } else {
        data.append(key, formData[key]);
      }
    }
    data.append("existingImages", JSON.stringify(existingImages));
    const response = await axios.put(`${API_BASE_URL}/listing/update-listing/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in updateListing:", err);
    throw err;
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/listing/delete-listing/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in deleteListing:", err);
    throw err;
  }
};

export const getRecentListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/listings/recent`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in getRecentListings:", err);
    throw err;
  }
};

export const getListingById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listing/listings/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in getListingById:", err);
    throw err;
  }
};