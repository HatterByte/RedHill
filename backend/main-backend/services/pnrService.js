import PnrData from "../models/PnrData.js";

export const fetchPNRDetails = async (pnr) => {
    try {
        // Validate PNR
        if (!pnr || pnr.length < 10) {
            return {
                success: false,
                message: "Invalid PNR",
            };
        }

        // Fetch PNR details from the database
        const pnrDetails = await PnrData.findOne({ pnrNumber: pnr });

        // If PNR not found in the database, return a mockup response
        if (!pnrDetails) {
            return {
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
        }

        // If PNR is found, return the actual details
        return {
            success: true,
            pnrDetails,
        };
    } catch (error) {
        console.error("Error fetching PNR details:", error);
        return {
            success: false,
            message: "Failed to fetch PNR details",
            error: error.message,
        };
    }
};
