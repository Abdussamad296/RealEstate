import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/state`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error in getDashboardData:", err);
    throw err;
  }
};

export const getMonthlyStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/monthly-state`, {
        withCredentials: true,
        });
        return response.data;
    } catch (err) {
        console.error("Error in getMonthlyStats:", err);
        throw err;
    }
}
