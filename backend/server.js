const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://hurtsproject.netlify.app',
            'https://hurtsproject.netlify.app/',
            'https://disaster-management-backend-production.up.railway.app'
        ];
        
        // Check if the origin is in the allowed origins
        if (allowedOrigins.includes(origin) || 
            /^https?:\/\/[^\s]+\.netlify\.app(\/.*)?$/.test(origin) ||
            /^https?:\/\/[^\s]+\.railway\.app(\/.*)?$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS with the options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use("/api", authRoutes);

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

// 👉 Routes
const volunteerRoutes = require("./routes/volunteerRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ NEW

app.use("/api/volunteers", volunteerRoutes);
app.use("/api", authRoutes); // ✅ NEW

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

