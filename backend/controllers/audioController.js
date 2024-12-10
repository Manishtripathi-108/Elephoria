// controllers/audioController.js
const { uploadAudio, editMetadata } = require("../services/audioService");
const { backendLogger } = require("../utils/logger");

exports.uploadAudioHandler = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded!" });
	}

	const response = await uploadAudio(req.file);
	backendLogger.info("Audio upload response:", response);
	return res.status(response.success ? 200 : 500).json(response);
};

exports.editMetadataHandler = async (req, res) => {
	try {
		const data = await editMetadata(req);
		return successResponse(res, data);
	} catch (error) {
		return errorResponse(res, "Failed to edit metadata", error);
	}
};
