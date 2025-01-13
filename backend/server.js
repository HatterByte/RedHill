const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();


// Middleware
// app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});