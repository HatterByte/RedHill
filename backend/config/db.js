import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\u{2705} Connected to MongoDB Atlas');
  } catch (err) {
    console.error("\u{274C} DB Connection Error:", err);
    process.exit(1);
  }
}

