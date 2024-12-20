import { existsSync, unlinkSync } from "fs";
import { join, resolve } from "path";
import { uploadAudio, editMetadata } from "../services/audio.service.js";
import { backendLogger } from "../utils/logger.utils.js";

export const uploadAudioHandler = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded!" });
	}

	if (!req.file.mimetype.startsWith("audio/")) {
		return res.status(400).json({ message: "Invalid audio file!" });
	}

	try {
		const result = await uploadAudio(req.file);
		if (!result.success) {
			backendLogger.error("Error uploading audio file:", result.message);
			return res.status(500).json(result);
		}
		return res.status(200).json(result);
	} catch (error) {
		backendLogger.error("Error uploading audio file:", error);
		return res.status(500).json({ message: "Internal server error!" });
	}
};

export const editMetadataHandler = async (req, res) => {
	try {
		const file = join(resolve("./uploads/audio"), req.body.name);
		const outputFile = join(
			resolve("./uploads/audio"),
			`edited_${Date.now()}_${req.body.name}`
		);

		// Check if the original file exists
		if (!existsSync(file)) {
			backendLogger.error("Audio file not found!");
			return res
				.status(404)
				.json({ message: "Audio file not found! Please reupload." });
		}

		// Edit metadata
		const result = await editMetadata(req.body.metadata, file, outputFile);
		if (!result.success) {
			backendLogger.error(result.message);
			return res.status(500).json({ message: result.message });
		}

		// Send the edited file for download
		res.download(outputFile, (err) => {
			if (err) {
				backendLogger.error("File download failed:", err);
				return res
					.status(500)
					.json({ message: "File download failed!" });
			}

			// Cleanup files
			try {
				if (existsSync(file)) unlinkSync(file);
				if (existsSync(outputFile)) unlinkSync(outputFile);
			} catch (cleanupError) {
				backendLogger.error("Error during file cleanup:", cleanupError);
			}
		});
	} catch (error) {
		backendLogger.error("Error editing metadata:", error);
		return res.status(500).json({ message: "Internal server error!" });
	}
};
