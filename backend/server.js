const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = require('./app');
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Additional packages you'll need to install:
// npm install express cors body-parser