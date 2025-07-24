const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gsaiganeshh:qHjxmwCZIkKpckIs@cluster0.63a5qv5.mongodb.net/disasterDB?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "hari_super_secret_key";

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

let User;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", userSchema);
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
    
    const path = event.path.replace('/.netlify/functions/auth', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // Signup Route
    if (path === '/signup' && method === 'POST') {
      const { name, email, password } = body;

      try {
        const existing = await User.findOne({ email });
        if (existing) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "User already exists" })
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET, { expiresIn: "1h" });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ token })
        };
      } catch (err) {
        console.error("Signup Error:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Signup failed: " + err.message })
        };
      }
    }

    // Login Route
    if (path === '/login' && method === 'POST') {
      const { email, password } = body;

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "User not found" })
          };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "Invalid credentials" })
          };
        }

        const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "1h" });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ token })
        };
      } catch (err) {
        console.error("Login Error:", err);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Login failed" })
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Route not found" })
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
