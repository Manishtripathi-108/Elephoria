import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { handleAudioUpload, handleExtractMetadata, handleEditMetadata } from '../controllers/audio.controller.js';
import { extname } from 'path';
import { createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';

const router = Router();

/* ------------------ Multer configuration for file uploads ----------------- */
const storage = diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = getTempPath('audio');
        try {
            await createDirectoryIfNotExists(uploadPath);
            cb(null, uploadPath);
        } catch (error) {
            cb(error, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const filenameFormat = `audio_${Date.now()}${extname(file.originalname)}`;
        cb(null, filenameFormat);
    },
});

const audioFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
        return cb(null, true);
    } else {
        return cb(new Error('Invalid file type. Please upload an audio file.'));
    }
};

const upload = multer({ storage: storage, fileFilter: audioFileFilter });

/* ------------------------ Error Handling Middleware ----------------------- */
const uploadMiddleware = (req, res, next) => {
    upload.single('audio')(req, res, (err) => {
        if (err instanceof multer.MulterError || err instanceof Error) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error.',
            });
        }
        next();
    });
};

/* ------------------------------ Routes Setup ------------------------------ */
router.post('/upload', uploadMiddleware, handleAudioUpload);

router.post('/extract-metadata', handleExtractMetadata);
router.post('/edit-metadata', handleEditMetadata);

export default router;
