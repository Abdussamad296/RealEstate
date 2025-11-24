import React from "react";
import HomePage from "./Pages/HomePage";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./Pages/CreateListing";
import ListingDetails from "./Pages/ListingDetails";
import OtpVerification from "./Pages/OtpVerification";
import ForgotPasswordModal from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ContactUs from "./Pages/Contact";
import DashboardLayout from "./Components/DashboardLayout";
import Combineddashboard from "./Pages/Dashboard/Combineddashboard";
import MyListings from "./Pages/MyListings";
import Messages from "./Pages/Messages";
import PropertyList from "./Pages/PropertyList ";
import { SocketProvider } from "./context/SocketContext";
import useSocketNotifications from "./hooks/useSocketNotifications";

const App = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || null;
  useSocketNotifications();
  return (
    <div>
      <SocketProvider user={loggedInUser}>
        <BrowserRouter>
          <Header />

          <Routes>
            {/* Public pages (no Sidebar) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPasswordModal />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Private pages (Sidebar appears) */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Combineddashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="my-listings" element={<MyListings />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/saved-properties" element={<PropertyList />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </div>
  );
};

export default App;
