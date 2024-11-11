// controllers/audioController.js
const { uploadAudio, editMetadata } = require("../services/audioService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.uploadAudioHandler = async (req, res) => {
	try {
		const data = await uploadAudio(req);
		return successResponse(res, data);
	} catch (error) {
		return errorResponse(res, "Audio upload failed", error);
	}
};

exports.editMetadataHandler = async (req, res) => {
	try {
		const data = await editMetadata(req);
		return successResponse(res, data);
	} catch (error) {
		return errorResponse(res, "Failed to edit metadata", error);
	}
};
