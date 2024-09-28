const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
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
// app.post("/api/upload", upload.single("audio"), (req, res) => {
// 	if (!req.file) {
// 		return res.status(400).json({ message: "No file uploaded!" });
// 	}
// 	res.json({ message: "File uploaded successfully!", file: req.file });
// });

// Route to upload audio and extract metadata
app.post("/api/upload", upload.single("audio"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded!" });
	}

	// Use ffprobe to extract metadata from the uploaded audio file
	ffmpeg.ffprobe(req.file.path, (err, metadata) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error extracting metadata", error: err });
		}

		// Metadata from ffprobe
		const extractedMetadata = {
			format: metadata.format.format_name,
			duration: metadata.format.duration,
			bitrate: metadata.format.bit_rate,
			tags: metadata.format.tags, // Includes title, artist, album, etc., if available
		};

		// Send response with metadata
		res.json({
			message: "File uploaded and metadata extracted successfully!",
			file: req.file,
			metadata: extractedMetadata,
		});
	});
});

// Endpoint for editing metadata
app.post("/api/edit-metadata", upload.single("audio"), (req, res) => {
	const { artist, album, title } = req.body;
	const filePath = req.file.path;
	const outputFile = `uploads/edited_${Date.now()}.mp3`;

	ffmpeg(filePath)
		.outputOptions([
			`-metadata artist=${artist}`,
			`-metadata album=${album}`,
			`-metadata title=${title}`,
		])
		.save(outputFile)
		.on("end", () => {
			res.download(outputFile, (err) => {
				if (err) {
					console.error("Error sending the edited file:", err);
				}

				// Delete the uploaded and processed files after the download
				fs.unlinkSync(filePath);
				fs.unlinkSync(outputFile);
			});
		})
		.on("error", (err) => {
			console.error("Error editing metadata:", err);
			res.status(500).json({ error: "Error processing the file" });
		});
});

// Endpoint for converting audio format
app.post("/api/convert", upload.single("audio"), (req, res) => {
	const format = req.body.format; // Desired format (e.g., 'mp3', 'wav')
	const filePath = req.file.path;
	const outputFile = `uploads/converted_${Date.now()}.${format}`;

	ffmpeg(filePath)
		.toFormat(format)
		.save(outputFile)
		.on("end", () => {
			res.download(outputFile, (err) => {
				if (err) {
					console.error("Error sending the converted file:", err);
				}

				// Delete the uploaded and processed files after the download
				fs.unlinkSync(filePath);
				fs.unlinkSync(outputFile);
			});
		})
		.on("error", (err) => {
			console.error("Error converting file:", err);
			res.status(500).json({ error: "Error converting the file" });
		});
});

// Set PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port: http://localhost:${PORT}`);
});
