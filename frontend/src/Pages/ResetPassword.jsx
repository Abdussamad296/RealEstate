import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../Service/auth.service";
import toast from "react-hot-toast";
import {
  signStart,
  signInSuccess,
  signFailure,
  resetLoading,
} from "../../redux/user/userSlice";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    email: state?.email || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.otp) newErrors.otp = "OTP is required";
    else if (!otpRegex.test(formData.otp))
      newErrors.otp = "OTP must be a 6-digit number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      dispatch(signFailure(newErrors));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      dispatch(signStart());
      const res = await resetPassword(formData);
      dispatch(signInSuccess(res.data));
      toast.success("Password reset successful! Redirecting to sign in...");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";
      dispatch(signFailure({ general: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-lg flex overflow-hidden h-[37rem] mt-20">
        {/* Form Section (Left Half) */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Reset Password
          </h1>
          {error?.general && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
              {error.general}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-full border ${
                  error?.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none transition-all duration-200`}
                aria-label="Email"
                disabled={loading || !!state?.email} // Disable if from forgot password
              />
              {error?.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded-full border ${
                  error?.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none transition-all duration-200`}
                aria-label="New Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              {error?.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 rounded-full border ${
                  error?.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none transition-all duration-200`}
                aria-label="Confirm Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-4 text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              {error?.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {error.confirmPassword}
                </p>
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
                "Reset Password"
              )}
            </button>
            <div className="flex justify-center space-x-2 text-gray-600 dark:text-gray-300">
              <p>Remember your password?</p>
              <Link to="/sign-in">
                <span className="text-blue-500 font-semibold hover:underline">
                  Sign In
                </span>
              </Link>
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

export default ResetPassword;
