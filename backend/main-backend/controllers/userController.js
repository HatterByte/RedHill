import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid user credentials" });
    } else {
      const isMatch = await bcryptjs.compare(password, user.password);
      if (isMatch) {
        const options = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          secure: false,
          httpOnly: true,
        };
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        return res
          .cookie("accessToken", token, options)
          .status(200)
          .json({ message: "User logged in sucessfully" });
      } else {
        return res.json({ message: "Wrong Password!" });
      }
    }
  } catch (error) {
    console.log("Error: " + error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const loggedIn = false;
    res.clearCookie("accessToken"); // Clear the cookie
    return res
      .status(200)
      .json({ message: "User logged out successfully", loggedIn }); // Send the response
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


