import { backendLogger } from './logger.utils.js';

export const successResponse = (res, data) => res.status(200).json({ success: true, ...data });

/**
 * Sends an error response with a specified HTTP status code, logs the error, and
 * includes the error message in the response.
 *
 * @param {Object} res - The Express.js response object.
 * @param {string} [message='Internal Server Error'] - The error message to log and send in the response.
 * @param {Error} [error] - The error object to log.
 * @param {number} [status=500] - The HTTP status code to send in the response.
 */
export const errorResponse = (res, message = 'Internal Server Error', error, status = 500) => {
    backendLogger.error(message, error);
    res.status(status).json({ success: false, message: message, error });
};

/**
 * Sends an error response with a specified HTTP status code, logs the error, and
 * includes retry-after and x-ratelimit-remaining headers from the AniList API error
 * response.
 *
 * @param {Object} res - The Express.js response object.
 * @param {string} message - The error message to send in the response.
 * @param {Error} error - The error object to log.
 */
export const anilistErrorResponse = (res, message, error) => {
    backendLogger.error(message, error);

    const retryAfterSeconds = error.response?.headers['retry-after'];
    const remainingRateLimit = error.response?.headers['x-ratelimit-remaining'];

    if (error.response?.status === 401 || error.response?.status === 400) {
        return res.status(error.response?.status || 400).json({
            message: error?.response?.data.hint || 'Session expired. Please log in again.',
            error: error?.response?.data || 'Invalid or expired token.',
            retryAfterSeconds,
            remainingRateLimit,
        });
    }

    res.status(500).json({
        message,
        error: error || 'Unexpected server error.',
        retryAfterSeconds,
        remainingRateLimit,
    });
};
