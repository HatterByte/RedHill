import User from "../models/User.js";
import Complaints from "../models/Complaints.js";
import mongoose from "mongoose";
import { fetchPNRDetails } from "../services/pnrService.js";
import { analyzeComplaint } from "../services/aiService.js";

/**
 * Register a new complaint
 * @route POST complaints/register
 */
export const registerComplaint = async (req, res) => {
  try {
    const isLoggedIn = req.loggedIn || false;

    const {
      pnr,
      phone,
      name,
      gender,
      age,
      description = "",
      category,
      subCategory,
      media = [],
    } = req.body;

    if (!pnr) {
      return res.status(400).json({ success: false, message: "PNR is required" });
    }

    let userPhone = phone;
    let userName = name;
    let userId = null;  // Store MongoDB _id of the user

    if (isLoggedIn && req.user) {
      userId = req.user._id;  // Use MongoDB _id
      userPhone = userPhone || req.user.phone;
      userName = userName || req.user.name;
    } else if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    if (!description && media.length === 0 && (!category || !subCategory)) {
      return res.status(400).json({
        success: false,
        message: "Either description, media, or category and subcategory must be provided",
      });
    }

    const pnrDetails = await fetchPNRDetails(pnr);

    if (!pnrDetails.success) {
      return res.status(400).json({ success: false, message: "Invalid PNR or unable to fetch PNR details" });
    }

    const { trainCode, trainName, trainDepartureDate } = pnrDetails;

    let complaintAnalysis = {
      category: category || "",
      subCategory: subCategory || "",
      severity: "Low",
    };

    if ((!category || !subCategory) && (description || media.length > 0)) {
      complaintAnalysis = await analyzeComplaint({ description, media });
    }

    const lastComplaint = await Complaints.findOne().sort({ complaintId: -1 });

    const complaintId = lastComplaint && lastComplaint.complaintId
      ? Number(lastComplaint.complaintId) + 1
      : 1000;  // Start from 1000 if no complaints exist

    // console.log("Generated complaintId:", complaintId);

    const newComplaint = new Complaints({
      complaintId, // Keep it for user-facing reference
      user_Id: userId, // Use MongoDB _id reference
      phone: userPhone,
      name: userName || "Anonymous",
      gender: gender || "",
      age: age || null,
      pnr,
      trainCode,
      trainName,
      trainDepartureDate,
      media,
      description,
      category: complaintAnalysis.category,
      subCategory: complaintAnalysis.subCategory,
      severity: complaintAnalysis.severity,
      employeeWorking: "",
      resolved: 0,
    });

    await newComplaint.save();

    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { complaintTickets: newComplaint._id.toString() } } // Store `_id` instead of `complaintId`
      );
    }

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaintId,
      category: complaintAnalysis.category,
      subCategory: complaintAnalysis.subCategory,
      severity: complaintAnalysis.severity,
    });
  } catch (error) {
    console.error("Error registering complaint:", error);
    return res.status(500).json({ success: false, message: "Failed to register complaint", error: error.message });
  }
};


/**
 * Get complaint details by MongoDB `_id`
 * @route GET /complaints/complaint/:complaintId
 * @access Private (Only complaint owner or admin)
 */
export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID format",
      });
    }

    // Find complaint
    const complaint = await Complaints.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }


    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if the logged-in user is the complaint owner or an admin
    if (req.user._id.toString() !== complaint.user_Id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to view this complaint.",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint",
      error: error.message,
    });
  }
};
  

/**
 * Get all complaints for a user
 * @route GET /complaints/user/:userId
 * @access Private (Only complaint owner or admin)
 */
export const getUserComplaints = async (req, res) => {
  try {
    let { userId } = req.params;

    // If user requests their own complaints, use logged-in user's ID
    if (userId === "me") {
      if (!req.loggedIn || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required to access your complaints",
        });
      }
      userId = req.user._id.toString(); // Convert to string for MongoDB lookup
    }

    // Validate userId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // If the logged-in user is not the requested user and is not an admin, deny access
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to view these complaints.",
      });
    }

    // Fetch complaints for the user
    const complaints = await Complaints.find({ user_Id: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user complaints",
      error: error.message,
    });
  }
};

/**
 * Get all complaints (admin only)
 * @route GET complaints
 */
export const getAllComplaints = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.loggedIn || !req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Optional filtering
    const { category, subCategory, resolved, severity, startDate, endDate } =
      req.query;

    const filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (resolved !== undefined) filter.resolved = parseInt(resolved);
    if (severity) filter.severity = severity;

    // Date range filtering
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const complaints = await Complaints.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaints.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};
