// This file is the entry point for Render
// It simply imports and starts the backend server

// Load environment variables first
require('dotenv').config({ path: __dirname + '/backend/.env' });

// Start the server
require('./backend/server');
