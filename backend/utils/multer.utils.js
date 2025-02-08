import { createDirectoryIfNotExists, getTempPath } from './pathAndFile.utils.js';
import { errorResponse } from './response.utils.js';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 * Creates a Multer storage engine for storing uploaded files in a temporary directory.
 *
 * @param {string} type - The type of file being uploaded (e.g. 'audio', 'image').
 *                        This is used to create a subdirectory in the temporary directory.
 * @returns {import('multer').StorageEngine} - The Multer storage engine.
 */
export const createTempStorage = (type) =>
    diskStorage({
        destination: async (req, file, cb) => {
            const uploadPath = getTempPath(type);
            try {
                await createDirectoryIfNotExists(uploadPath);
                cb(null, uploadPath);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
            const filenameFormat = `${type}_${Date.now()}${extname(file.originalname)}`;
            cb(null, filenameFormat);
        },
    });

/**
 * Returns a Multer middleware function that checks if an uploaded file is of the specified type.
 *
 * @param {string} type - The type of file to check for (e.g. 'audio', 'image').
 * @returns {(req: Request, file: Express.Multer.File, cb: (err: Error, result: boolean) => void) => void} - The Multer middleware function.
 */
export const checkFileType = (type) => (req, file, cb) => {
    if (file.mimetype.startsWith(type)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Please upload a ${type} file.`));
    }
};

/**
 * Creates a middleware function for handling file uploads using Multer.
 *
 * @param {Function} upload - The Multer upload function, configured to handle specific file uploads.
 * @returns {Function} - An Express middleware function that processes file uploads and handles any errors.
 *                       If an error occurs during the upload, it sends an error response with a 400 status code.
 *                       Otherwise, it calls the next middleware in the stack.
 */
export const createUploadMiddleware = (upload) => (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            errorResponse(res, err?.message || 'File upload error.', err, 400);
        } else next();
    });
};
