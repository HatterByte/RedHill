import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("\u{2705} Connected to MongoDB for otp service");
    } catch (error) {
        console.error("\u{274C} MongoDB Connection Error:", error);
        process.exit(1);
    }
};
