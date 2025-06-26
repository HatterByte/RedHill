import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../config/redis.js";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      req.loggedIn = false;
      return next();
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

    // Verify the token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie("accessToken");
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.clearCookie("accessToken");
      await redisClient.del(`auth:${userId}`);
      req.loggedIn = false;
      return next();
    }

    req.user = user;
    req.loggedIn = true;
    next();
  } catch (error) {
    console.error("Auth Middleware error:", error);
    req.loggedIn = false;
    next();
  }
};

export default auth;
