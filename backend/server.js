import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AuthRoutes from './routes/auth.js';
import UserRoutes from './routes/user.js';
import TestRoutes from './routes/test.js';
import ComplaintRoutes from './routes/complaint.js';
import PnrRoutes from './routes/pnr.js';

dotenv.config();
const app = express();

app.use(cors({
    // origin: 'http://localhost:5173', // Adjust for your frontend
    origin:true,
    credentials: true // Allow credentials (cookies)
}));
app.use(cookieParser());



// Connect Database
connectDB();


//Init Middleware
app.use(express.json({extended:false}));

// Routes
app.get('/', (req, res) => {
    res.send('API Running');
});
app.use('/auth',AuthRoutes);
app.use('/user',UserRoutes);
app.use('/test',TestRoutes);
app.use('/complaints',ComplaintRoutes);
app.use('/pnr',PnrRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});