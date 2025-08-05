// This file is the entry point for Render
// It simply imports and starts the backend server

// Set the working directory to the backend folder
process.chdir(__dirname + '/backend');

// Start the server
require('./server');
