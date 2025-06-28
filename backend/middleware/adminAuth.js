import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../config/redis.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded._id) {
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded._id;
    const cachedToken = await redisClient.get(`auth:${userId}`);
    if (!cachedToken || cachedToken !== token) {
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user || !user.isAdmin) {
      res.clearCookie("accessToken");
      await redisClient.del(`auth:${userId}`);
      return res.status(403).json({ message: "Admin access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Auth Middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminAuth;
