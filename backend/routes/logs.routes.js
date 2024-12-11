import { Router } from "express";
import { backendLogger, frontendLogger } from "../utils/logger.utils.js";
const router = Router();

// Log frontend messages to frontend.log
router.post("/frontend", (req, res) => {
	const { level, message, metadata, timestamp } = req.body;

	if (!level || !message) {
		return res
			.status(400)
			.json({ error: "Log level and message are required." });
	}

	frontendLogger.log({
		level,
		message: `[Frontend] ${message}`,
		...metadata,
		timestamp,
	});

	res.status(200).json({ success: true });
});

// Log backend messages to backend.log
router.post("/backend", (req, res) => {
	const { level, message, metadata, timestamp } = req.body;

	if (!level || !message) {
		return res
			.status(400)
			.json({ error: "Log level and message are required." });
	}

	backendLogger.log({
		level,
		message: `[Backend] ${message}`,
		metadata,
		timestamp,
	});

	res.status(200).json({ success: true });
});

export default router;
