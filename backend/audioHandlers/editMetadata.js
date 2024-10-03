const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

// Function to handle metadata editing
const editMetadata = (req, res) => {
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

module.exports = { editMetadata };
