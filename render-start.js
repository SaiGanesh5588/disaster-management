// This file is used by Render to start the backend server
// It's placed in the root directory to help Render find the entry point

// Set the working directory to the backend folder
process.chdir(__dirname + '/backend');

// Start the server
require('./server');
