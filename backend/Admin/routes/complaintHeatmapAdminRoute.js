import express from "express";
import { getComplaintsHeatmap } from "../controllers/complaintHeatmapAdminController.js";

const router = express.Router();

// GET /admin/complaints/heatmap
router.get("/heatmap", getComplaintsHeatmap);

export default router;
