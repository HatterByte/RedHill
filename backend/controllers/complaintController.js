import User from "../models/User.js";
import Complaints from "../models/Complaints.js";
import { fetchPNRDetails } from "../services/pnrService.js";
import { analyzeComplaint } from "../services/aiService.js";

/**
 * Register a new complaint
 * @route POST complaints/register
 */
export const registerComplaint = async (req, res) => {
  try {
    // Check if user is logged in (from middleware)
    const isLoggedIn = req.loggedIn || false;

    const {
      // Required fields
      pnr,
      phone,

      // Optional fields
      userId,
      name,
      gender,
      age,
      description = "",
      category,
      subCategory,
      media = [], // Array of media URLs
    } = req.body;

    // Validate PNR (always required)
    if (!pnr) {
      return res.status(400).json({
        success: false,
        message: "PNR is required",
      });
    }

    // If user is logged in but no phone is provided, get it from the user object
    let userPhone = phone;
    let userName = name;
    let userDetails = null;

    if (isLoggedIn && req.user) {
      // If user is logged in, we can use their stored details
      userDetails = req.user;
      userPhone = userPhone || userDetails.phone;
      userName = userName || userDetails.name;
    } else if (!phone) {
      // If not logged in, phone is required
      return res.status(400).json({
        success: false,
        message: "Phone number is required for non-logged in users",
      });
    }

    // Either description, media, or category/subcategory must be provided
    if (!description && media.length === 0 && (!category || !subCategory)) {
      return res.status(400).json({
        success: false,
        message:
          "Either description, media, or category and subcategory must be provided",
      });
    }

    // Fetch PNR details
    const pnrDetails = await fetchPNRDetails(pnr);

    if (!pnrDetails.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid PNR or unable to fetch PNR details",
      });
    }

    // Extract train details from PNR
    const { trainCode, trainName, trainDepartureDate } = pnrDetails;

    // Initialize complaint analysis with defaults or provided values
    let complaintAnalysis = {
      category: category || "",
      subCategory: subCategory || "",
      severity: "Low", // Default severity
    };

    // If categories aren't provided manually, use AI to analyze
    if ((!category || !subCategory) && (description || media.length > 0)) {
      complaintAnalysis = await analyzeComplaint({
        description,
        media,
      });
    }

    // const lastComplaint = await Complaints.findOne().sort({ complaintId: -1 });

    // const complaintId = lastComplaint && lastComplaint.complaintId
    //   ? Number(lastComplaint.complaintId) + 1
    //   : 1000; // Start from 1000 if no complaints exist
    const complaintId = Math.floor(Math.random() * 1000000) + 1000;
    
    console.log("Generated complaintId:", complaintId); 

    // Determine the user ID to use
    const actualUserId = phone || (isLoggedIn && req.user ? req.user.phone : null);


    // Create new complaint
    const newComplaint = new Complaints({
      complaintId,
      user_Id: actualUserId,
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
      resolved: 0, // Not resolved
    });

    await newComplaint.save();

    // If user is logged in or userId is provided, add complaint to their profile
    if (actualUserId) {
        await User.findOneAndUpdate(
            { phone: actualUserId }, // Use phone instead of _id
            { $push: { complaintTickets: complaintId.toString() } }
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
    return res.status(500).json({
      success: false,
      message: "Failed to register complaint",
      error: error.message,
    });
  }
};

/**
 * Helper function to get user name from userId
 */
const getUserName = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.name : "Unknown";
  } catch (error) {
    return "Unknown";
  }
};

/**
 * Get complaint details by ID
 * @route GET complaints/complaint/:complaintId
 */
export const getComplaintById = async (req, res) => {
    try {
      let { complaintId } = req.params;
  
      // Validate that complaintId is a valid number
      if (!complaintId || isNaN(complaintId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint ID",
        });
      }
  
      complaintId = parseInt(complaintId);
  
      const complaint = await Complaints.findOne({ complaintId });
  
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
 * @route GET complaints/user/:userId
 */
export const getUserComplaints = async (req, res) => {
  try {
    // If userId is "me", use the logged-in user's ID
    let userId = req.params.userId;

    if (userId === "me") {
      if (!req.loggedIn || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required to access your complaints",
        });
      }
      userId = req.user._id;
    }

    const complaints = await Complaints.find({ user_Id: phone }).sort({ createdAt: -1 });


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
