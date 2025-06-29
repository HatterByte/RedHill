import express from "express";
import {
  getAllComplaints,
  updateComplaint,
  getComplaintsWithImages,
  getUsersComplaintsSummary,
} from "../controllers/complaintAdminController.js";
import adminAuth from "../../middleware/adminAuth.js";
const router = express.Router();

// Admin get all complaints route
router.get("/", adminAuth, getAllComplaints);
router.get("/mlresult", adminAuth, getComplaintsWithImages);
router.patch("/:id", adminAuth, updateComplaint);
router.get("/complaints-summary", adminAuth, getUsersComplaintsSummary);

export default router;
