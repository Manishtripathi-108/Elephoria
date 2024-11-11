const { logger } = require("./logger");

exports.successResponse = (res, data) =>
	res.status(200).json({ success: true, data });

exports.errorResponse = (res, message, error) => {
	logger(message, error);
	res.status(500).json({ success: false, message, error });
};
exports.anilistErrorResponse = (res, message, error) => {
	logger(message, error);

	const retryAfterSeconds = error.response?.headers["retry-after"];
	const remainingRateLimit = error.response?.headers["x-ratelimit-remaining"];

	if (error.response?.status === 401) {
		return res.status(401).json({
			message: "Session expired. Please log in again.",
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
