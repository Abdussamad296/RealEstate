import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import TempUser from "../model/otp.model.js";
import { sendEmail } from "../service/emailService.js";
import { errorHandler, serverHandlerError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const signup = async (req, res) => {
  console.log("Request Body:", req.body);
  const { username, email, password } = req.body;

  const errors = [];
  

  if (!username) errors.push({ msg: "Username is required" });
  if (!email) errors.push({ msg: "Email is required" });
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push({ msg: "Invalid email format" });
  }
  if (!password) errors.push({ msg: "Password is required" });
  else if (password.length < 6)
    errors.push({ msg: "Password must be at least 6 characters" });

  if (errors.length > 0) {
    return errorHandler(res, 400, "Validation errors", errors);
  }

  try {
    // Check if user already exists in main users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorHandler(res, 400, "Email already in use", {
        msg: "Email already in use",
      });
    }

    // Check if email is already in temp users collection
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      return errorHandler(res, 400, "Email is pending verification", {
        msg: "Email is pending verification",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();

    // Store user data and OTP in TempUser collection
    const tempUser = new TempUser({
      username,
      email,
      password: hashedPassword,
      otp,
    });
    await tempUser.save();

    // Send OTP to user's email
    await sendEmail({
      to: email,
      subject: "Your OTP for Account Verification",
      message: `Your OTP is <b>${otp}</b>. It is valid for 10 minutes.`,
    });

    res.status(200).json({
      msg: "OTP sent to your email",
      data: { email },
    });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const verifyOtp = async (req, res) => {
  console.log("Request Body:", req.body);
  const { otp, email } = req.body;

  const errors = [];
  if (!email) errors.push({ msg: "Email is required" });
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push({ msg: "Invalid email format" });
  }
  if (!otp) errors.push({ msg: "OTP is required" });
  else if (!/^\d{6}$/.test(otp))
    errors.push({ msg: "OTP must be a 6-digit number" });

  if (errors.length > 0) {
    return errorHandler(res, 400, "Validation errors", errors);
  }

  try {
    // Retrieve temporary user data from TempUser collection
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return errorHandler(res, 400, "OTP expired or invalid", {
        msg: "OTP expired or invalid",
      });
    }

    if (tempUser.otp !== otp) {
      return errorHandler(res, 400, "Invalid OTP", {
        msg: "Invalid OTP",
      });
    }

    // Create user in main users collection
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
    });
    const userdata = await newUser.save();

    // Delete temporary user data
    await TempUser.deleteOne({ email });

    // Generate JWT
    const token = jwt.sign(
      { id: userdata._id, email: userdata.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...others } = userdata._doc;

    res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({
        msg: "User registered successfully",
        data: { ...others, token },
      });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const errors = [];

  if (!email) {
    errors.push({ msg: "Email is required" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push({ msg: "Invalid email format" });
  }
  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      errors.push({ msg: "No pending verification for this email" });
    }

    const newOtp = generateOtp();

    tempUser.otp = newOtp;
    tempUser.createdAt = Date.now();
    await tempUser.save();

    await sendEmail({
      to: email,
      subject: "Your OTP for Account Verification",
      message: `Your OTP is <b>${newOtp}</b>. It is valid for 10 minutes.`,
    });

    res.status(200).json({ msg: "OTP resent to your email" });
  } catch (error) {
    serverHandlerError(res, error);
  }
};

export const signin = async (req, res) => {
  console.log("Request Body:", req.body);
  const { email, password } = req.body;
  const errors = [];
  if (!email) errors.push({ msg: "Email is required" });
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push({ msg: "Invalid email format" });
  }
  if (!password) errors.push({ msg: "Password is required" });
  else if (password.length < 6)
    errors.push({ msg: "Password must be at least 6 characters" });
  if (errors.length > 0) {
    return errorHandler(res, 400, "Validation errors", errors);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return errorHandler(res, 400, "User not Found", {
        msg: "User not Found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return errorHandler(res, 400, "Invalid Credentials", {
        msg: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const { password: pass, ...others } = existingUser._doc;

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        msg: "SignIn Successful",
        data: { ...others, token },
      });
  } catch (error) {
    return serverHandlerError(res, error);
  }
};

export const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...others } = user._doc;
      res
        .cookie("token", token, { httpOnly: true }, { expiresIn: "1h" })
        .status(200)
        .json({
          msg: "SignIn Successful",
          data: { ...others, token },
        });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword, 10);

      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        img: req.body.img,
      });

      const userdata = await newUser.save();
      const token = jwt.sign({ id: userdata._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...others } = userdata._doc;
      res
        .cookie("token", token, { httpOnly: true }, { expiresIn: "1h" })
        .status(200)
        .json({
          msg: "SignIn Successful",
          data: { ...others, token },
        });
    }
  } catch (err) {}
};

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return errorHandler(res, 403, "Forbidden", {
      msg: "You can only update your own account",
    });
  }

  const { username, email, password, img } = req.body;
  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (img) updateFields.img = img;
  if (password) {
    if (password.length < 6) {
      return errorHandler(res, 400, "Validation error", {
        msg: "Password must be at least 6 characters",
      });
    }
    updateFields.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedUser) {
      return errorHandler(res, 404, "Not Found", { msg: "User not found" });
    }
    const { password: pass, ...others } = updatedUser._doc;
    res.status(200).json({
      msg: "User updated successfully",
      data: others,
    });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ msg: "Logged out successfully" });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) errors.push({ msg: "Email is required" });
  else if (!emailRegex.test(email))
    errors.push({ msg: "Invalid email format" });
  if (errors.length > 0) {
    return errorHandler(res, 400, "Validation errors", errors);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorHandler(res, 404, "User not found", {
        msg: "User not found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await TempUser.findOneAndUpdate(
      { email },
      { email, otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      message: `Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.`,
    });

    res.status(200).json({ msg: "Password reset OTP sent to your email" });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};

export const resetPassword = async (req, res) => {
  console.log("Request Body:", req.body);
  const { otp, email, password } = req.body;

  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const otpRegex = /^\d{6}$/;

  if (!email) errors.push({ msg: "Email is required" });
  else if (!emailRegex.test(email))
    errors.push({ msg: "Invalid email format" });
  if (!otp) errors.push({ msg: "OTP is required" });
  else if (!otpRegex.test(otp))
    errors.push({ msg: "OTP must be a 6-digit number" });
  if (!password) errors.push({ msg: "Password is required" });
  else if (password.length < 6)
    errors.push({ msg: "Password must be at least 6 characters" });

  if (errors.length > 0) {
    return errorHandler(res, 400, "Validation errors", errors);
  }

  try {
    // Check if OTP exists in TempUser collection
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return errorHandler(res, 400, "OTP expired or invalid", {
        msg: "OTP expired or invalid",
      });
    }

    if (tempUser.otp !== otp) {
      return errorHandler(res, 400, "Invalid OTP", {
        msg: "Invalid OTP",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the User collection
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!user) {
      return errorHandler(res, 404, "User not found", {
        msg: "User not found",
      });
    }

    // Delete the temporary OTP record
    await TempUser.deleteOne({ email });

    // Generate a new JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: pass, ...others } = user._doc;

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        msg: "Password reset successfully",
        data: { ...others, token },
      });
  } catch (err) {
    return serverHandlerError(res, err);
  }
};
