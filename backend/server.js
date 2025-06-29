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
import AuthAdminRoutes from "./Admin/routes/authAdminRoute.js";
import ComplaintAdminRoutes from "./Admin/routes/complaintAdminRoute.js";
import ComplaintStatsAdminRoutes from "./Admin/routes/complaintStatsAdminRoute.js";
import complaintHeatmapAdminRoute from "./Admin/routes/complaintHeatmapAdminRoute.js";
import morgan from "morgan";
import logger from "./utils/logger.js";

dotenv.config();
const app = express();

const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: isProduction ? process.env.FRONTEND_URL :'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

// Connect Database
connectDB();
connectRedis();

//Init Middleware
app.use(express.json({ extended: false }));

// Morgan middleware to log HTTP requests using winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/test", TestRoutes);
app.use("/complaints", ComplaintRoutes);
app.use("/otp", otpRoutes);
//Admin routes
app.use("/admin/auth", AuthAdminRoutes);
app.use("/admin/complaints", ComplaintAdminRoutes);
app.use("/admin/complaints-stats", ComplaintStatsAdminRoutes);
app.use("/admin/complaints", complaintHeatmapAdminRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\u{1F680} Server is running on port ${PORT}`);
});
