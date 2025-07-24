const Donation = require("../models/Donation");

// Create a new donation
const createDonation = async (req, res) => {
  try {
    const { name, donationType, amount, quantity, description, location, contact } = req.body;

    const newDonation = new Donation({
      name,
      donationType,
      amount,
      quantity,
      description,
      location,
      contact
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation created successfully", donation: newDonation });
  } catch (error) {
    res.status(500).json({ error: "Error creating donation", details: error.message });
  }
};

// Get all donations
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donations", details: error.message });
  }
};

module.exports = { createDonation, getDonations };
