const express = require('express');
const app = express();
const http = require('http');
const PORT = 5000;

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic route for testing
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ 
    status: 'success',
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test endpoint: GET /api/test');
  console.log('='.repeat(60));
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

console.log('Server initialization complete');
