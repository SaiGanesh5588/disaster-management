const Volunteer = require("../models/Volunteer");

// Get all volunteers
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Add a new volunteer
const addVolunteer = async (req, res) => {
    try {
        const { name, email, phone, location, age } = req.body;
        const newVolunteer = new Volunteer({ name, email, phone, location, age });
        await newVolunteer.save();
        res.status(201).json({ message: "Volunteer added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getVolunteers, addVolunteer };
