import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { uploadAudioHandler, editMetadataHandler } from '../controllers/audio.controller.js';
import { extname } from 'path';
import { createDirectoryIfNotExists, getTempPath } from '../utils/path.utils.js';

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

const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), uploadAudioHandler);
router.post('/edit-metadata', editMetadataHandler);

export default router;
