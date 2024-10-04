const ffmpeg = require("fluent-ffmpeg");

// Function to handle audio upload and extract metadata
const uploadAudio = (req, res) => {
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

		// Send response with metadata
		res.json({
			message: "File uploaded and metadata extracted successfully!",
			file: req.file,
			metadata: metadata,
		});
	});
};

module.exports = { uploadAudio };
