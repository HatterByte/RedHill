import User from "../models/User.js";

/**
 * @desc    Get user profile
 * @route   GET /user/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    if (!req.loggedIn) {
      return res.status(200).json({ user: null, message: "Not Logged in" });
    }

    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
