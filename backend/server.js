const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env') });



// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Perform cleanup and exit
    process.exit(1); // Exit with failure
});

const app = express();

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`, {
        query: req.query,
        body: req.body,
        headers: req.headers
    });
    next();
});

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:5173', // Vite frontend
        'http://127.0.0.1:5173', // Vite frontend
        /^https?:\/\/disaster-management-[a-z0-9]+\.railway\.app$/, // Railway deployment
        /^https?:\/\/disaster-management-[a-z0-9]+-[a-z0-9]+\.railway\.app$/ // Railway previews
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));



// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const donationRoutes = require("./routes/donationRoutes");

// Use routes
app.use("/api", authRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Debug signup endpoint
app.post("/api/debug-signup", (req, res) => {
  console.log('Debug signup endpoint hit');
  res.json({ 
    success: true, 
    message: "Debug signup working",
    receivedData: req.body 
  });
});

// Direct test signup endpoint (bypassing routes)
app.post("/api/direct-signup", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify({ 
    success: true, 
    message: "Direct signup test",
    data: req.body 
  }));
});

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// MongoDB connection with retry logic
const connectDB = async () => {
    const MAX_RETRIES = 5;
    let retryCount = 0;
    
    const connectWithRetry = async () => {
        try {
            console.log('Attempting to connect to MongoDB...');
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log('MongoDB connected successfully');
        } catch (error) {
            retryCount++;
            console.error(`MongoDB connection error (attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
            
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying connection in 5 seconds...`);
                setTimeout(connectWithRetry, 5000);
            } else {
                console.error('Max retries reached. Could not connect to MongoDB.');
                process.exit(1);
            }
        }
    };

    await connectWithRetry();
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected from DB');
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('Received shutdown signal. Closing server...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Listen for shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        const HOST = process.env.HOST || '0.0.0.0';
        
        const server = app.listen(PORT, HOST, () => {
            const serverUrl = `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`;
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode at ${serverUrl}`);
            
            // Log database connection status
            const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
            console.log(`MongoDB connection status: ${dbStatus}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                const errorMsg = `Port ${PORT} is already in use`;
                logger.error(errorMsg);
                console.error(errorMsg);
            } else {
                logger.error(`Server error: ${error.message}`);
                console.error(`Server error: ${error.message}`);
            }
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            const errorMsg = `Unhandled Rejection: ${err.message}`;
            logger.error(errorMsg);
            console.error(errorMsg);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            const errorMsg = `Uncaught Exception: ${err.message}`;
            console.error(errorMsg);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

        return server;

    } catch (error) {
        const errorMsg = `Failed to start server: ${error.message}`;
        console.error(errorMsg);
        process.exit(1);
    }
};

startServer();





