import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUsers,
  logout,
} from "../../redux/user/userSlice";
import { deleteUser } from "../Service/user.service";
import { updateUser } from "../Service/auth.service";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../Service/auth.service";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.img);
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setImageError("");

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64Img = reader.result;
        setLoading(true);
        dispatch(updateStart());
        updateUser(currentUser._id, { img: base64Img })
          .then((updatedData) => {
            dispatch(updateSuccess(updatedData));
            setImageError("");
            toast.success("Profile image updated! 🎉");
          })
          .catch((err) => {
            dispatch(updateFailure(err.message));
            setImageError(err.message || "Image upload failed");
            toast.error(err.message || "Image upload failed");
          })
          .finally(() => setLoading(false));
      };
      reader.onerror = (error) => {
        console.error("Error converting to Base64:", error);
        dispatch(updateFailure("Image conversion failed"));
        setImageError("Image conversion failed");
        toast.error("Image conversion failed");
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {};
    if (username !== currentUser.username) userData.username = username;
    if (email !== currentUser.email) userData.email = email;
    if (password) userData.password = password;

    if (Object.keys(userData).length > 0) {
      setLoading(true);
      dispatch(updateStart());
      updateUser(currentUser._id, userData)
        .then((updatedData) => {
          dispatch(updateSuccess(updatedData));
          toast.success("Profile updated successfully! ✨");
        })
        .catch((err) => {
          dispatch(updateFailure(err.message));
          toast.error(err.message || "Update failed");
        })
        .finally(() => setLoading(false));
    } else {
      toast("No changes detected 🧐");
    }
  };

  const handleDeleteAccount = () => {
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const respone = await deleteUser(currentUser._id);
      dispatch(deleteUsers());
      toast.success(respone.message || "Account deleted successfully");
      setOpenDeleteModal(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Deletion failed");
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  const handleSignout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/");
      toast("You have been signed out 👋");
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Sign out failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 pb-10 bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 mt-20">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Main Container - Adjusted for wider screen space */}
      <div className="w-full max-w-5xl lg:max-w-6xl">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 tracking-tight text-center sm:text-left">
          Account Settings
        </h1>

        {/* Profile Card - Horizontal Split */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column (Picture & Status) */}
            <div className="lg:col-span-1 p-8 sm:p-10 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                hidden
                ref={fileRef}
              />

              {/* Profile Picture Area */}
              <div
                className="relative w-40 h-40 rounded-full overflow-hidden cursor-pointer group transition-all duration-300 transform hover:scale-105 shadow-xl ring-4 ring-white dark:ring-gray-800"
                onClick={() => fileRef.current.click()}
              >
                <img
                  src={preview}
                  alt="profile"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
                {currentUser.username}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser.email}
              </p>

              {imageError && (
                <span className="text-red-500 text-sm mt-4 font-medium text-center">
                  {imageError}
                </span>
              )}

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                Member since{" "}
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-around gap-4 mt-6 border-t pt-4 border-gray-100 dark:border-gray-700">
                <button
                  className="dark:text-red-400 cursor-pointer text-sm font-medium transition-colors duration-200 bg-red-600 text-white py-1 px-4 rounded-full shadow-md"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
                <button
                  className="cursor-pointer text-sm font-medium transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full shadow-md"
                  onClick={handleSignout}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Right Column (Form Inputs) */}
            <div className="lg:col-span-2 p-8 sm:p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Update Your Details
              </h2>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Username Input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-3 rounded-full border border-gray-200 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm text-sm"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-full border border-gray-200 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm text-sm"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col relative">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Leave blank to keep current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-600 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm text-lg"
                  />
                  <span
                    className="absolute right-4 top-2/3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </span>
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 p-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-[1.005] shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/70 ${
                    loading
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-500/40"
                  } flex justify-center items-center gap-2 text-lg`}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  )}
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal (Remains centered and fixed) */}
      {openDeleteModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform scale-100 transition-transform duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Account Deletion ⚠️
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              This action is **irreversible**. All your data will be permanently
              deleted.
            </p>
            <div className="flex justify-around gap-4">
              <button
                className={`flex-1 px-3 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-200 shadow-md text-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-md text-lg"
                onClick={() => setOpenDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
