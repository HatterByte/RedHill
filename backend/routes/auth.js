import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import {
  requestOTP,
  verifyOTP,
  registerUser,
  verifyOTPLogin,
  loginWithPassword,
  logoutUser,
  resetPassword
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";
dotenv.config();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", registerUser);
router.post("/login-otp", verifyOTPLogin);
router.post("/login-password", loginWithPassword);
router.post("/logout", logoutUser);
router.post("/reset-password",resetPassword);

export default router;
