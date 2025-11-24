import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "../Service/auth.service";
import toast from "react-hot-toast";
import {
  signStart,
  signInSuccess,
  signFailure,
  resetLoading,
} from "../../redux/user/userSlice";

const OtpVerification = () => {
  const { state } = useLocation();
  const { email, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    otp: "",
    email: email || "", // Use email from Redux
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetLoading());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(signFailure(null));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const otpRegex = /^\d{6}$/;

    if (!formData.email)
      newErrors.general = "Please complete signup process first";
    if (!formData.otp) newErrors.otp = "OTP is required";
    else if (!otpRegex.test(formData.otp))
      newErrors.otp = "OTP must be a 6-digit number";

    if (Object.keys(newErrors).length > 0) {
      dispatch(signFailure(newErrors));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      dispatch(
        signFailure({ general: "Please complete signup process first" })
      );
      toast.error("Please complete signup process first");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      dispatch(signStart());
      const res = await verifyOtp(formData); // Send { otp, email }
      dispatch(signInSuccess(res.data));
      toast.success("OTP verified successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect to home page
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";
      dispatch(signFailure({ general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.email) {
      dispatch(
        signFailure({ general: "Please complete signup process first" })
      );
      toast.error("Please complete signup process first");
      return;
    }

    try {
      dispatch(signStart());
      await resendOtp({ email: formData.email }); // Send { email }
      dispatch(signFailure(null));
      toast.success("OTP resent successfully! Please check your email.");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to resend OTP";
      dispatch(signFailure({ general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-lg flex overflow-hidden h-[37rem]">
        {/* Form Section (Left Half) */}
        <div className="w-full lg:w-2/5 p-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Verify OTP
          </h1>
          {error?.general && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mt-5">
              {error.general}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full p-3 rounded-full border ${
                  error?.otp ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none transition-all duration-200`}
                aria-label="OTP"
                disabled={loading}
              />
              {error?.otp && (
                <p className="text-red-500 text-sm mt-1">{error.otp}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-3 rounded-full bg-blue-600 text-white font-semibold uppercase tracking-wide hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                "Verify OTP"
              )}
            </button>
            <div className="flex justify-center space-x-2 text-gray-600 dark:text-gray-300">
              <p>Didn't receive an OTP?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-500 font-semibold hover:underline"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
        {/* Image Section (Right Half) */}
        <div
          className="hidden lg:block w-3/5 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          }}
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};

export default OtpVerification;
