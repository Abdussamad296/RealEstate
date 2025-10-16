const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

console.log("API_BASE_URL in auth:", API_BASE_URL);

export const signUp = async (userData) => {
  console.log("Signing in user:", userData);
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (err) {
    console.log("Error in signIn:", err);
    throw err;
  }
};

export const signIn = async (userData) => {
  console.log("Signing in user:", userData);
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Error in signIn:", err);
    throw err;
  }
};

export const googleAuth = async (userData) => {
  try {

    const respone = await axios.post(`${API_BASE_URL}/auth/google`,userData,{
      withCredentials:true,
    })
    return respone.data;
  } catch (error) {
    console.log("Error in googleAuth:", error);
    throw error;
  }
};


export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/auth/update/${userId}`, userData, {
      withCredentials: true,  
    });
    return response.data.data;
  } catch (err) {
    console.log("Error in updateUser:", err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Error in logout:", err);
    throw err;
  }
};

export const verifyOtp = async (otpData) => {
  console.log("Verifying OTP:", otpData);
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, otpData, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Error in verifyOtp:", err);
    throw err;
  }
};

export const resendOtp = async (emailData) => {
  console.log("Resending OTP for:", emailData);
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, emailData, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log("Error in resendOtp:", err);
    throw err;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, data);
    return response.data;
  } catch (err) {
    console.log("Error in forgotPassword:", err);
    throw err;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, data);
    return response.data;
  } catch (err) {
    console.log("Error in resetPassword:", err);
    throw err;
  }
};
