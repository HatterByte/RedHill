import express from "express";
import { getTopComplaintTypes } from "../controllers/complaintStatsAdminController.js";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();

// GET /admin/complaints/top-types?limit=5
router.get("/top-types",adminAuth, getTopComplaintTypes);

export default router;
