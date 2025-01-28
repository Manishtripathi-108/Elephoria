import { createDirectoryIfNotExists, getTempPath } from './pathAndFile.utils.js';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { errorResponse } from './response.utils.js';

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

export const checkFileType = (type) => (req, file, cb) => {
    if (file.mimetype.startsWith(type)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Please upload a ${type} file.`));
    }
};

export const createUploadMiddleware = (upload) => (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            errorResponse(res, err?.message || 'File upload error.', err, 400);
        } else next();
    });
};
