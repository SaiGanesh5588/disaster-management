const Donation = require("../models/Donation");

// Create a new donation
const createDonation = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    const { name, donationType, amount, quantity, description, location, contact } = req.body;

    // Validate required fields
    if (!name || !donationType || !location || !contact) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['name', 'donationType', 'location', 'contact'] 
      });
    }

    const newDonation = new Donation({
      name,
      donationType,
      amount: amount ? Number(amount) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      description,
      location,
      contact
    });

    console.log('New donation object:', newDonation);
    
    const savedDonation = await newDonation.save();
    console.log('Donation saved successfully:', savedDonation);
    
    res.status(201).json({ 
      message: 'Donation created successfully', 
      donation: savedDonation 
    });
  } catch (error) {
    console.error('Error in createDonation:', error);
    res.status(500).json({ 
      error: 'Error creating donation', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
