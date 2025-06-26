import express from "express";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import UserRoutes from "./routes/user.js";
import TestRoutes from "./routes/test.js";
import ComplaintRoutes from "./routes/complaint.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    // origin: 'http://localhost:5173', // Adjust for your frontend
    origin: true,
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

// Connect Database
connectDB();
connectRedis();

//Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/test", TestRoutes);
app.use("/complaints", ComplaintRoutes);
app.use("otp", otpRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\u{1F680} Server is running on port ${PORT}`);
});
