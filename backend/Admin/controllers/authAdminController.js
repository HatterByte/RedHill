import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import redisClient from "../../config/redis.js";

/**
 * @desc    Login with password
 * @route   POST /admin/auth/login-password
 * @access  Public
 */
export const loginWithPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || phone.length !== 10 || !password)
      return res.status(400).json({ message: "Invalid input" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isAdmin)
      return res.status(403).json({ message: "Access denied" });
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
      secure: isProduction, // ✅ HTTPS only in production (Render uses HTTPS)
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
 * @desc    Admin logout
 * @route   POST /admin/auth/logout
 * @access  Admin
 */
export const logoutAdmin = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      // Decode token to get user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await redisClient.del(`auth:${decoded._id}`);
    }
    const isProduction = process.env.NODE_ENV === "production";
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction, // ✅ HTTPS only in production (Render uses HTTPS)
        sameSite: isProduction ? "None" : "Lax",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
