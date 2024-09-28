const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

// Set PORT from environment or default to 5000
const PORT = process.env.PORT || 3000;

// Basic route to test server
app.get('/api', (req, res) => {
    res.send('Hello from Backend!');
});

// Route to handle file uploads
app.post('/api/upload', upload.single('audio'), (req, res) => {
    res.json({ message: 'File uploaded successfully!', file: req.audio });
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
