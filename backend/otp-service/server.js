import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import otpRoutes from "./routes/otpRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    // origin: 'http://localhost:5173', // Adjust for your frontend
    // origin: 'http://localhost:5000', // Adjust for your main-backend
    origin: true,
    credentials: true, // Allow credentials (cookies)
  })
);

app.use("/otp", otpRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`\u{1F680} OTP Service running on port ${PORT}`));
