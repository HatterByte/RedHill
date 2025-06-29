import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import axios from "axios";
import redisClient from "../config/redis.js";
import { sendMessage } from "../utils/sendMessage.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * @desc    Generate OTP and send it to the user's phone number
 * @route   POST /auth/request-otp
 * @access  Public
 */
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({ message: "Phone number is required" });

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number. Must be 10 digits." });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please link your Telegram first." });
    }

    if (!user.chatId) {
      return res
        .status(400)
        .json({ message: "Please link your Telegram first." });
    }

    const otp = generateOTP();
    const hashedOTP = await bcryptjs.hash(otp, 10);
    await redisClient.setEx(
      `otp:${phone}`,
      300,
      JSON.stringify({ otp: hashedOTP, verified: false })
    ); // Store OTP in Redis (expires in 5 min)

    await sendMessage(user.chatId, `🔢 Your OTP is : ${otp}`);
    // await axios.post("http://localhost:8000/otp/send-otp", { phone, otp });

    res.status(200).json({ message: "OTP sent successfully via telegram" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Verify OTP sent to the user's phone number
 * @route   POST /auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    const data = await redisClient.get(`otp:${phone}`);
    const { otp: hashedOTP, verified } = JSON.parse(data);
    const isMatch = await bcryptjs.compare(otp, hashedOTP);

    if (isMatch) {
      await redisClient.setEx(
        `otp:${phone}`,
        600,
        JSON.stringify({ otp: hashedOTP, verified: true })
      );
      return res.status(200).json({ message: "OTP verified successfully" });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Register user after OTP verification
 * @route   POST /auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { phone, name, password } = req.body;
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone and password are required" });
    }
    const otpData = await redisClient.get(`otp:${phone}`);
    if (!otpData)
      return res.status(400).json({ message: "OTP verification required" });

    const { verified } = JSON.parse(otpData);
    if (!verified) return res.status(400).json({ message: "OTP not verified" });

    let user = await User.findOne({ phone });
    if (user && user.password) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.name = name;
    await user.save();
    await redisClient.del(`otp:${phone}`);
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      httpOnly: true,
    };
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await redisClient.setEx(`auth:${user._id}`, 9000, token);
    const safeUser = user.toObject(); // Convert to plain object
    delete safeUser.password;
    return res
      .cookie("accessToken", token, options)
      .status(200)
      .json({ message: "User Registered sucessfully", user: safeUser });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Verify OTP & Login user using phone and OTP
 * @route   POST /auth/login-otp
 * @access  Public
 */
export const verifyOTPLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || phone.length !== 10 || !otp)
      return res.status(400).json({ message: "Invalid input" });

    // Get OTP data from Redis
    const data = await redisClient.get(`otp:${phone}`);
    if (!data) return res.status(400).json({ message: "OTP expired" });

    const { otp: hashedOTP } = JSON.parse(data);

    const isMatch = await bcryptjs.compare(otp, hashedOTP);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
    await redisClient.del(`otp:${phone}`);
    // Find user or create one if not exists
    let user = await User.findOne({ phone }).select("-password");
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      httpOnly: true,
    };
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await redisClient.setEx(`auth:${user._id}`, 9000, token);

    return res
      .cookie("accessToken", token, options)
      .status(200)
      .json({ message: "Login Successful", user });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Login with password
 * @route   POST /auth/login-password
 * @access  Public
 */
export const loginWithPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || phone.length !== 10 || !password)
      return res.status(400).json({ message: "Invalid input" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password)
      return res.status(403).json({ message: "Set a password first" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      httpOnly: true,
    };
    const safeUser = user.toObject(); // Convert to plain object
    delete safeUser.password;
    await redisClient.setEx(`auth:${user._id}`, 9000, token);
    return res
      .cookie("accessToken", token, options)
      .status(200)
      .json({ message: "Login Successful", user: safeUser });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Reset password using OTP verification
 * @route   POST /auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify OTP
    const data = await redisClient.get(`otp:${phone}`);
    if (!data) return res.status(400).json({ message: "OTP expired" });

    const { otp: hashedOTP, verified } = JSON.parse(data);
    if(!verified) {
      return res.status(400).json({ message: "OTP not verified" });
    }
    const isMatch = await bcryptjs.compare(otp, hashedOTP);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Find user and update password
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await redisClient.del(`otp:${phone}`);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Logout user
 * @route   POST /auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) return res.status(200).json({ message: "Already logged out" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    await redisClient.del(`auth:${userId}`);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("accessToken", {
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      secure: false,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
