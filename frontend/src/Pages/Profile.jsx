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
            toast.success("Profile image updated!");
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
          toast.success("Profile updated successfully!");
        })
        .catch((err) => {
          dispatch(updateFailure(err.message));
          toast.error(err.message || "Update failed");
        })
        .finally(() => setLoading(false));
    } else {
      toast("No changes detected");
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
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  const handleSignout = async() => {
    try{
      await logoutUser();
      dispatch(logout());
      navigate("/");
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-5">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Your Profile
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            hidden
            ref={fileRef}
          />
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="profile"
              className="rounded-full w-24 h-24 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-300"
              onClick={() => fileRef.current.click()}
            />
            {imageError && (
              <span className="text-red-600 text-sm mt-2">{imageError}</span>
            )}
            <span className="text-gray-500 text-sm mt-1">
              Click image to change
            </span>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 p-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } flex justify-center items-center gap-2`}
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <Link to={"/create-listing"}
          className="bg-green-700 p-3 rounded-xl text-white text-center font-semibold hover:bg-green-800 transition"
          >
            Create Listing
          </Link>
        </form>
      </div>
      <div className="flex justify-between mt-4 w-full max-w-md px-8 text-sm">
        <button
          className="text-red-600 cursor-pointer hover:underline"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
        <button 
        className="text-blue-600 cursor-pointer hover:underline"
        onClick={handleSignout}
        >
          Sign Out
        </button>
      </div>

      {openDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-around mt-6">
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl hover:bg-gray-400"
                onClick={() => setOpenDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
