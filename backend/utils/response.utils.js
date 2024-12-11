import { backendLogger } from "./logger.utils.js";

export const successResponse = (res, data) =>
	res.status(200).json({ success: true, data });

export const errorResponse = (res, message, error) => {
	backendLogger.error(message, error);
	res.status(500).json({ success: false, message, error });
};

export const anilistErrorResponse = (res, message, error) => {
	backendLogger.error(message, error);

	const retryAfterSeconds = error.response?.headers["retry-after"];
	const remainingRateLimit = error.response?.headers["x-ratelimit-remaining"];

	if (error.response?.status === 401 || error.response?.status === 400) {
		return res.status(error.response?.status || 400).json({
			message:
				error?.response?.data.hint ||
				"Session expired. Please log in again.",
			error: error?.response?.data || "Invalid or expired token.",
			retryAfterSeconds,
			remainingRateLimit,
		});
	}

	res.status(500).json({
		message,
		error: error || "Unexpected server error.",
		retryAfterSeconds,
		remainingRateLimit,
	});
};
