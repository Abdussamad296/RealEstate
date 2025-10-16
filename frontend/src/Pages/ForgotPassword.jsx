import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Service/auth.service";
import toast from "react-hot-toast";
import { signStart, signFailure } from "../../redux/user/userSlice";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [resetEmail, setResetEmail] = useState("");
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail) {
      toast.error("Email is required");
      return;
    }
    if (!emailRegex.test(resetEmail)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      dispatch(signStart());
      await forgotPassword({ email: resetEmail });
      toast.success("Password reset OTP sent to your email!");
      setResetEmail("");
      onSuccess(resetEmail); // Trigger navigation or other success action
    } catch (err) {
      dispatch(signFailure(err.message || "Failed to send reset OTP"));
      toast.error(err.message || "Failed to send reset OTP");
    } finally {
      dispatch(signStart(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Forgot Password
        </h2>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label
              htmlFor="resetEmail"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter your email address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
              aria-label="Reset Email"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:underline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
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
                "Send Reset OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
