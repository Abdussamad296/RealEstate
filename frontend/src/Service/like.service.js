import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const likeHandle = async (listingId, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/listing/${listingId}/like`,
      { userId }
    );

    return res.data; 
  } catch (error) {
    console.error("Error in likeHandle:", error);
    return null;
  }
};
