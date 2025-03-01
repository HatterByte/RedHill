import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      req.loggedIn = false; // Mark as not logged in
      return next(); // Proceed without blocking
    }

    // Verify the token
    const isVerified = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: isVerified._id }).select(
      "-password"
    );

    if (!user) {
      res.clearCookie("accessToken");
      req.loggedIn = false; // Mark as not logged in
      return next(); // Proceed without blocking
    }

    req.user = user; // Attach user data to the request
    req.loggedIn = true; // Mark as logged in
    next(); // Proceed to the next middleware/handler
  } catch (error) {
    req.loggedIn = false; // In case of any error, treat as not logged in
    next(); // Proceed without blocking
  }
};

export default auth;
