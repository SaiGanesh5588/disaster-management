const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected Successfully"))
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
