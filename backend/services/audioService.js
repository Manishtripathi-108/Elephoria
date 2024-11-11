const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

// Function to handle metadata editing
exports.editMetadata = (req, res) => {
	const filePath = req.file.path;
	const outputFile = `uploads/edited_${Date.now()}_${req.file.originalname}`;

	// Initialize the ffmpeg command with the input file path
	const command = ffmpeg(filePath);

	// Loop through req.body and add metadata options dynamically
	Object.entries(req.body).forEach(([key, value]) => {
		if (value) {
			// Ensure value is not empty or null before appending to metadata
			command.outputOptions("-metadata", `${key}=${value}`);
		} else if (value === null || value === "") {
			command.outputOptions(`-metadata`, `${key}=`);
		}
	});

	// Execute the ffmpeg command
	command
		// .audioBitrate("320")
		// .audioFrequency(48000)
		.outputOptions("-c copy") // Copy the stream without re-encoding
		.save(outputFile)
		.on("end", () => {
			// Send the edited file as a download
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
};

// Function to handle audio upload and extract metadata
exports.uploadAudio = (req, res) => {
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

		// Check if there is a stream containing a cover image
		const coverStream = metadata.streams.find(
			(stream) =>
				stream.codec_name === "mjpeg" || stream.codec_type === "video"
		);

		if (coverStream) {
			// Extract the cover image if available
			const coverImageName = `cover_${Date.now()}.jpg`;
			const coverImagePath = path.join("uploads", coverImageName);

			// Extract the cover image using FFmpeg
			ffmpeg(req.file.path)
				.outputOptions("-map", `0:${coverStream.index}`) // Select the cover image stream
				.save(path.join(__dirname, "../", coverImagePath)) // Save in uploads folder
				.on("end", () => {
					// Return metadata and HTTP URL to the cover image
					res.json({
						message:
							"File uploaded and metadata extracted successfully!",
						file: req.file,
						metadata: metadata,
						coverImage: `http://localhost:3000/uploads/${coverImageName}`, // Return the HTTP URL
					});
				})
				.on("error", (err) => {
					console.error("Error extracting cover image:", err);
					res.status(500).json({
						error: "Error extracting cover image",
					});
				});
		} else {
			// If no cover image is found, just return metadata
			res.json({
				message: "File uploaded and metadata extracted successfully!",
				file: req.file,
				metadata: metadata,
				coverImage: null, // No cover image
			});
		}
	});
};
