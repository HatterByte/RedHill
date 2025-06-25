import User from "../models/User.js";
import bcryptjs from "bcryptjs";

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

/**
 * @desc    Update user profile
 * @route   PUT /user/update-profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    if (!req.loggedIn) {
      return res.status(401).json({ message: "Not Logged in" });
    }

    const userId = req.user._id;
    const { name, password } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
