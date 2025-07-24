const mongoose = require("mongoose");

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gsaiganeshh:qHjxmwCZIkKpckIs@cluster0.63a5qv5.mongodb.net/disasterDB?retryWrites=true&w=majority&appName=Cluster0";

// Donation Schema
const donationSchema = new mongoose.Schema({
  name: String,
  donationType: String,
  amount: Number,
  quantity: Number,
  description: String,
  location: String,
  contact: String,
});

let Donation;
try {
  Donation = mongoose.model("Donation");
} catch {
  Donation = mongoose.model("Donation", donationSchema);
}

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await connectDB();
    
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // Get All Donations
    if (method === 'GET') {
      try {
        const donations = await Donation.find();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(donations)
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: "Server Error" })
        };
      }
    }

    // Add Donation
    if (method === 'POST') {
      try {
        console.log("Incoming Request Data:", body);
        const donation = new Donation(body);
        await donation.save();
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ message: "Donation added successfully!" })
        };
      } catch (error) {
        console.error("Error saving donation:", error.message);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: "Server Error", error: error.message })
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
