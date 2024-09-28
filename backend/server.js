const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
// const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

/* ------------------------------- Middleware ------------------------------- */
app.use(cors());
app.use(express.json());

/* ------------------ Multer configuration for file uploads ----------------- */
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${new Date().toISOString().replace(/:/g, "-")}-${
				file.originalname
			}`
		);
	},
});

const upload = multer({ storage: storage });

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
app.get("/api", (req, res) => {
	res.send("Hello from Backend!");
});

// Route to handle file uploads
app.post("/api/upload", upload.single("audio"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded!" });
	}
	res.json({ message: "File uploaded successfully!", file: req.file });
});

// Set PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port: http://localhost:${PORT}`);
});
