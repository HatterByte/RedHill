import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import axios from "axios";
import redisClient from "../config/redis.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

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
    await redisClient.setEx(`otp:${phone}`, 300, hashedOTP); // Store OTP in Redis (expires in 5 min)

    await axios.post("http://localhost:8000/otp/send-otp", { phone, otp });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    const storedOTP = await redisClient.get(`otp:${phone}`);
    const isMatch = await bcryptjs.compare(otp, storedOTP);

    if (isMatch) {
      await redisClient.del(`otp:${phone}`);
      return res.status(200).json({ message: "OTP verified successfully" });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const loggedIn = req.loggedIn;

    if (loggedIn) {
      // User is logged in, fetch user details
      const user = await User.findOne({ _id: req.user._id });
      return res.status(200).json({
        message: "User fetched successfully",
        user,
        loggedIn,
      });
    } else {
      // User is not logged in
      return res.status(200).json({ message: "Not logged in", loggedIn });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const CreatedUser = await User.create({
        name: name,
        phone: phone,
        password: hashPassword,
        complaintTickets: [],
      });
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        //only manipulate by server not by client/user
        secure: false,
        httpOnly: true,
      };
      const token = jwt.sign({ _id: CreatedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res
        .cookie("accessToken", token, options)
        .status(200)
        .json({ message: "User Registered sucessfully", CreatedUser });
    }
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
