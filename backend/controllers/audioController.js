const fs = require("fs");
const { uploadAudio, editMetadata } = require("../services/audioService");
const { backendLogger } = require("../utils/logger");

exports.uploadAudioHandler = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded!" });
	}

	if (!req.file.mimetype.startsWith("audio/")) {
		return res.status(400).json({ message: "Invalid Audio file!" });
	}

	await uploadAudio(req.file).then((result) => {
		if (!result.success) {
			backendLogger.error(result.message);
		}
		return res.status(result.success ? 200 : 500).json(result);
	});
};

exports.editMetadataHandler = async (req, res) => {
	const file = `uploads/audio/${req.body.name}`;
	const outputFile = `uploads/audio/edited_${Date.now()}_${req.body.name}`;

	if (!fs.existsSync(file)) {
		return res
			.status(404)
			.json({ message: "Audio file not found! Please Reupload" });
	}

	await editMetadata(req.body.metadata, file, outputFile)
		.then((result) => {
			if (!result.success) {
				backendLogger.error(result.message);
				return res.status(500).json(result);
			}

			return res.download(outputFile);
		})
		.finally(() => {
			fs.unlinkSync(file);
			// fs.unlinkSync(outputFile);
		});
};
