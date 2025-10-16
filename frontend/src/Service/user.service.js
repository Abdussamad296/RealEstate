import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/user/delete/${userId}`, {
        withCredentials: true,
        });
        return response.data;
    } catch (err) {
        console.log("Error in deleteUser:", err);
        throw err;
    }
}