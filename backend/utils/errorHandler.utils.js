import { errorResponse } from "./response.utils.js";

/**
 * Wraps an async function with error handling to be used as an Express
 * middleware. Catches any errors that occur, and sends an error response
 * to the client. If the error was a custom error, the error message will
 * be sent. If the error was an unexpected error, a generic error message
 * will be sent.
 *
 * @param {Function} fn - Async function to be wrapped.
 * @returns {Function} Wrapped function.
 */
export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        return errorResponse(res, 'Unexpected error occurred. Please try again.', error);
    }
};
