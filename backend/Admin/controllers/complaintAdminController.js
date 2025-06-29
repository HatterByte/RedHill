import Complaint from "../../models/Complaints.js";
import mongoose from "mongoose";

/**
 * @desc    Get all complaints (admin)
 * @route   GET /admin/complaints
 * @access  Admin
 * Query params: page, limit, phone, type, subtype, resolved, severity, train, dateRange (daily/weekly/monthly)
 */
export const getAllComplaints = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      type,
      subtype,
      resolved,
      severity,
      train,
      dateRange,
      phone,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    // console.log("Query Params:", req.query);
    const filter = {};
    if (type) filter.type = type;
    if (subtype) filter.subtype = subtype;
    if (typeof resolved !== "undefined") {
      if (resolved === "true" || resolved === "false") {
        filter.resolved = resolved === "true" ? 1 : 0;
      }
    }
    if (severity) filter.severity = severity;
    if (train) filter.trainCode = train;
    if (phone) filter.phone = phone;

    // Date range filter for daily/weekly/monthly
    if (dateRange) {
      const now = new Date();
      let startDate;
      if (dateRange === "daily") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateRange === "weekly") {
        const day = now.getDay();
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - day
        );
      } else if (dateRange === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      if (startDate) filter.createdAt = { $gte: startDate };
    }
    // console.log(filter);
    let complaints, total;

    // Pagination and normal fetch
    complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    total = await Complaint.countDocuments(filter);
    return res.status(200).json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Update a complaint (admin)
 * @route   PATCH /admin/complaints/:id
 * @access  Admin
 * Body: status (resolved), type, subtype
 */
export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved, type, severity, subtype } = req.body;
    const updateFields = {};
    if (typeof resolved !== "undefined")
      updateFields.resolved = Number(resolved); // ensure number type
    if (type) updateFields.type = type;
    if (subtype) updateFields.subtype = subtype;
    if (severity) {
      updateFields.severity = severity;
    }
    console.log("Update Fields:", updateFields);
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.status(200).json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get all complaints with images (ML result)
 * @route   GET /admin/complaints/mlresult
 * @access  Admin
 * Query params: page, limit
 */
export const getComplaintsWithImages = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = { media: { $exists: true, $not: { $size: 0 } } };
    const complaints = await Complaint.find(filter)
      .select("media type subtype severity")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Complaint.countDocuments(filter);
    // Format response to include image links, type, subtype, severity, and reference no
    const results = complaints.map((c) => ({
      referenceNo: c._id,
      images: c.media,
      type: c.type,
      subtype: c.subtype,
      severity: c.severity,
    }));
    return res.status(200).json({
      complaints: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Complaints With Images Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc    Get all users with their complaints count and ids
 * @route   GET /admin/complaints/complaints-summary
 * @access  Admin
 * Query params: limit, page
 */
export const getUsersComplaintsSummary = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    // Group by phone, get complaint ids for each
    const agg = [
      {
        $group: {
          _id: "$phone",
          complaints: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];
    const results = await Complaint.aggregate(agg);
    const total = await Complaint.distinct("phone");
    res.json({
      users: results.map((u) => ({
        phone: u._id,
        complaints: u.complaints,
        count: u.count,
      })),
      total: total.length,
      page,
      totalPages: Math.ceil(total.length / limit),
    });
  } catch (error) {
    console.error("User Complaints Summary Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
