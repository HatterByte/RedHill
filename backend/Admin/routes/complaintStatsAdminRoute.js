import express from "express";
import { getTopComplaintTypes } from "../controllers/complaintStatsAdminController.js";

const router = express.Router();

// GET /admin/complaints/top-types?limit=5
router.get("/top-types", getTopComplaintTypes);

export default router;
