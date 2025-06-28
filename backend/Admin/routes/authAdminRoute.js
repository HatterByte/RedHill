import express from "express";
import { loginWithPassword } from "../controllers/authAdminController.js";

const router = express.Router();

// Admin login route
router.post("/login-password", loginWithPassword);

export default router;
