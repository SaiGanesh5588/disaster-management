const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation"); // Model ni import cheyyali

// Get all donations
router.get("/", async (req, res) => {
    try {
        const donations = await Donation.find(); // MongoDB nunchi data thisukovadam
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
