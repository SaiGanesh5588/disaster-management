const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    location: String,
    age: Number
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
