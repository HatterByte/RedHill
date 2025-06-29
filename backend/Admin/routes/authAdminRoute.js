import express from "express";
import { loginWithPassword,logoutAdmin } from "../controllers/authAdminController.js";

const router = express.Router();

// Admin login route
router.post("/login-password", loginWithPassword);
router.post("/logout", logoutAdmin);

export default router;
