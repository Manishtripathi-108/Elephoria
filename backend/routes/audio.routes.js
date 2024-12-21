import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { uploadAudioHandler, editMetadataHandler } from '../controllers/audio.controller.js';

const router = Router();

/* ------------------ Multer configuration for file uploads ----------------- */
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/audio/');
    },
    filename: (req, file, cb) => {
        cb(null, `audio_${Date.now()}`);
    },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), uploadAudioHandler);
router.post('/edit-metadata', editMetadataHandler);

export default router;
