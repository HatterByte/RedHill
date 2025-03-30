import express from "express";
const router = express.Router();

// Dummy classification function
const classifyComplaint = (complaintData) => {
    return {
        type: "Security",
        subtype: "Theft of Passengers Belongings/Snatching",
        severity: "High",
    };
};

// Route to classify complaints
router.post("/classify-complaint", (req, res) => {
    const complaintData = req.body;
    if (!complaintData.text) {
        return res.status(400).json({ error: "Complaint description is required" });
    }

    const classification = classifyComplaint(complaintData);
    res.json(classification);
});

// Test route
router.get("/", (req, res) => {
    res.json({ message: "Test route is working!" });
});

export default router;
