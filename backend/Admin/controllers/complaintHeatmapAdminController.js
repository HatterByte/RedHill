import Complaint from "../../models/Complaints.js";
import moment from "moment";

/**
 * @desc    Get daily complaint counts for heatmap (last 12 months)
 * @route   GET /admin/complaints/heatmap
 * @access  Admin
 * Query params: months (default 12), start, end
 */
export const getComplaintsHeatmap = async (req, res) => {
  try {
    let { start, end, months } = req.query;
    if (!start || !end) {
      months = parseInt(months) || 12;
      end = moment().endOf("day").format("YYYY-MM-DD");
      start = moment()
        .subtract(months, "months")
        .startOf("day")
        .format("YYYY-MM-DD");
    }
    const startDate = moment(start, "YYYY-MM-DD").startOf("day");
    const endDate = moment(end, "YYYY-MM-DD").endOf("day");

    // Get all complaints in range
    const complaints = await Complaint.find({
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).select("createdAt");

    // Count complaints per day
    const dayMap = {};
    complaints.forEach((c) => {
      const day = moment(c.createdAt).format("YYYY-MM-DD");
      dayMap[day] = (dayMap[day] || 0) + 1;
    });

    // Fill all days in range
    const days = [];
    let day = moment(startDate);
    while (day.isSameOrBefore(endDate, "day")) {
      const dateStr = day.format("YYYY-MM-DD");
      days.push({ date: dateStr, value: dayMap[dateStr] || 0 });
      day.add(1, "day");
    }

    res.status(200).json(days); // Return array, not {days: ...}
  } catch (error) {
    console.error("Get Complaints Heatmap Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
