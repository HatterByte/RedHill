import PnrData from "../models/PnrData.js";

export const fetchPNRDetails = async (req, res) => {
    try {
        const pnr = req.params.pnr;

        // Validate PNR
        if (!pnr || pnr.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Invalid PNR",
            });
        }

        // Fetch PNR details from the database
        const pnrDetails = await PnrData.findOne({ pnrNumber: pnr });

        // If PNR not found in the database, return a mockup response
        if (!pnrDetails) {
            const mockupResponse = {
                success: true,
                pnr,
                trainCode: "12345",
                trainName: "Express Railway",
                trainDepartureDate: new Date().toISOString().split('T')[0],
                source: "DELHI",
                destination: "MUMBAI",
                bookingStatus: "CONFIRMED",
                passengerInfo: [
                    { name: "Passenger 1", age: 30, gender: "M", seatNumber: "B1-23" },
                ],
            };
            return res.status(200).json(mockupResponse);
        }

        // If PNR is found, return the actual details
        return res.status(200).json({
            success: true,
            pnrDetails,
        });
    } catch (error) {
        console.error("Error fetching PNR details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch PNR details",
            error: error.message,
        });
    }
};