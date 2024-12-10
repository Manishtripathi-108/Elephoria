const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { backendLogger } = require("../utils/logger");

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

exports.uploadAudio = async (file) => {
	let metadata;
	let coverImageName = `http://localhost:3000/uploads/images/no-cover.jpg`;

	try {
		// Use ffprobe to extract metadata from the uploaded audio file
		metadata = await new Promise((resolve, reject) => {
			ffmpeg.ffprobe(file.path, (err, extractedMetadata) => {
				if (err) {
					reject({
						success: false,
						message: "Error extracting metadata",
						error: err,
					});
				} else {
					resolve(extractedMetadata);
				}
			});
		});

		// Check if there is a stream containing a cover image
		const coverStream = metadata.streams.find(
			(stream) =>
				stream.codec_name === "mjpeg" || stream.codec_type === "video"
		);

		if (coverStream) {
			// Extract the cover image if available
			const coverImagePath = path.join(
				"uploads/images",
				`cover_${Date.now()}.jpg`
			);

			await new Promise((resolve, reject) => {
				ffmpeg(file.path)
					.outputOptions("-map", `0:${coverStream.index}`) // Select the cover image stream
					.save(path.join(__dirname, "../", coverImagePath)) // Save in uploads folder
					.on("end", () => {
						coverImageName = `http://localhost:3000/uploads/images/${path.basename(
							coverImagePath
						)}`;
						resolve();
					})
					.on("error", (err) => {
						backendLogger.error(
							"Error extracting cover image:",
							err
						);
						reject(err);
					});
			});
		}

		backendLogger.info("Metadata extracted successfully:", metadata);

		return {
			success: true,
			message: "File uploaded and metadata extracted successfully!",
			metadata: metadata,
			coverImage: coverImageName,
		};
	} catch (error) {
		backendLogger.error("Error in uploadAudio:", error);

		return {
			success: false,
			message: "Error processing file",
			error: error.message,
		};
	}
};
