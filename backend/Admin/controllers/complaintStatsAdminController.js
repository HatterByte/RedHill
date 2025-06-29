import Complaint from "../../models/Complaints.js";

/**
 * @desc    Get top K complaint types with their complaint count
 * @route   GET /admin/complaints/top-types?limit=5
 * @access  Admin
 * Query params: limit (default 5)
 */
export const getTopComplaintTypes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const result = await Complaint.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, type: "$_id", count: 1 } },
    ]);
    res.status(200).json({ topTypes: result });
  } catch (error) {
    console.error("Get Top Complaint Types Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
