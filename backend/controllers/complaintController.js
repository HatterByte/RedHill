import User from "../models/User.js";
import Complaints from "../models/Complaints.js";
import mongoose from "mongoose";
import { fetchPNRDetails } from "../services/pnrService.js";
import { analyzeComplaint } from "../services/aiService.js";
import { determineSeverity } from "../utils/severity.js";

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
      type,
      subtype,
      media = [],
    } = req.body;

    if (!pnr) {
      return res
        .status(400)
        .json({ success: false, message: "PNR is required" });
    }

    let userPhone = phone;
    let userName = name;
    let userId = null;

    if (isLoggedIn && req.user) {
      userId = req.user._id;
      userPhone = userPhone || req.user.phone;
      // Prefer req.user.name if available, then name from request, then 'Anonymous'
      userName =
        req.user.name && req.user.name.trim()
          ? req.user.name
          : name && name.trim()
          ? name
          : "Anonymous";
    } else {
      // Not logged in: use name from request or fallback
      userName = name && name.trim() ? name : "Anonymous";
      if (!phone) {
        return res
          .status(400)
          .json({ success: false, message: "Phone number is required" });
      }
    }

    if (!description && media.length === 0 && (!type || !subtype)) {
      return res.status(400).json({
        success: false,
        message:
          "Either description, media, or type and subtype must be provided",
      });
    }

    const pnrDetails = await fetchPNRDetails(pnr);

    if (!pnrDetails.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid PNR or unable to fetch PNR details",
      });
    }

    const { trainCode, trainName, trainDepartureDate } = pnrDetails;

    let complaintAnalysis = {
      type: type || "",
      subtype: subtype || "",
      severity: "",
    };

    if ((!type || !subtype) && (description || media.length > 0)) {
      complaintAnalysis = await analyzeComplaint({ description, media });
    }
    console.log("Complaint analysis result:", complaintAnalysis);

    let severity = determineSeverity(
      type || complaintAnalysis.type, subtype || complaintAnalysis.subtype
    );

    const newComplaint = new Complaints({ // Keep it for user-facing reference
      user_Id: userId, // Use MongoDB _id reference
      phone: userPhone,
      name: userName || "User",
      gender: gender || "",
      age: age || null,
      pnr,
      trainCode,
      trainName,
      trainDepartureDate,
      media,
      description,
      type: complaintAnalysis.type,
      subtype: complaintAnalysis.subtype,
      severity,
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
      id: newComplaint._id,
      type: complaintAnalysis.type,
      subtype: complaintAnalysis.subtype,
      severity,
    });
  } catch (error) {
    console.error("Error registering complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register complaint",
      error: error.message,
    });
  }
};

/**
 * Get complaint details by MongoDB `_id`
 * @route GET /complaints/complaint/:complaintId
 * @access Public
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
        message:
          "Access denied. You are not authorized to view these complaints.",
      });
    }

    // Fetch complaints for the user
    const complaints = await Complaints.find({ user_Id: userId }).sort({
      createdAt: -1,
    });

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
 * Update complaint details
 * @route PUT /complaints/:complaintId
 * @access Private (Only complaint owner)
 */
export const updateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { type, subtype, resolved } = req.body;

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

    // Check if the logged-in user is the complaint owner
    if (complaint.user_Id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own complaints.",
      });
    }

    // Create update object with only provided fields
    const updateFields = {};
    if (type) updateFields.type = type;
    if (subtype) updateFields.subtype = subtype;
    if (resolved !== undefined) updateFields.resolved = resolved;

    // If type or subtype is updated, recalculate severity
    if (type || subtype) {
      const newType = type || complaint.type;
      const newSubtype = subtype || complaint.subtype;
      updateFields.severity = determineSeverity(newType, newSubtype);
    }

    // If no fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // Update complaint
    const updatedComplaint = await Complaints.findByIdAndUpdate(
      complaintId,
      { $set: updateFields },
      { new: true } // Return updated document
    );

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message,
    });
  }
};
