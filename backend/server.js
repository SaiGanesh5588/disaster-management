const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");

dotenv.config();
const app = express();

// CORS Configuration - More permissive for development
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://hurtsproject.netlify.app',
            'https://disaster-management-backend-production.up.railway.app',
            'https://hurtsproject.netlify.app/' // Add trailing slash variant
        ];
        
        // Check if the origin is in the allowed list or if it's a development environment
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.log('Blocked CORS for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// Parse JSON bodies
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// API Routes
app.use("/api", authRoutes);
app.use("/api/volunteers", volunteerRoutes);

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((error) => console.error("MongoDB Connection Failed:", error));

// 👉 Donation Schema
const donationSchema = new mongoose.Schema({
    name: String,
    donationType: String,
    amount: Number,
    quantity: Number,
    description: String,
    location: String,
    contact: String,
});

const Donation = mongoose.model("Donation", donationSchema);

// 👉 Get All Donations
app.get("/api/donations", async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 👉 Add a Donation
app.post("/api/donations", async (req, res) => {
    try {
        console.log("Incoming Request Data:", req.body);
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json({ message: "Donation added successfully!" });
    } catch (error) {
        console.error("Error saving donation:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});



// Start Server
const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Allowed Origins:', allowedOrigins);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

