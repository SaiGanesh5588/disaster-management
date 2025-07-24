const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  donationType: { type: String, required: true },
  amount: { type: Number },
  quantity: { type: Number },
  description: { type: String },
  location: { type: String, required: true },
  contact: { type: String, required: true }
});

module.exports = mongoose.model("Donation", donationSchema);
