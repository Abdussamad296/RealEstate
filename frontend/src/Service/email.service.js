import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendEmail = async (emailData) => {
    console.log("Sending email with data:", emailData);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/email/send-email`,
      emailData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error in sendEmail:", err.response || err);
    throw err;
  }
};
