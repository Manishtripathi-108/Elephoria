import { handleExtractMetadata, handleEditMetadata, handleConvertAudio } from '../controllers/audio.controller.js';
import { checkFileType, createTempStorage, createUploadMiddleware } from '../utils/multer.utils.js';
import { Router } from 'express';
import multer from 'multer';


const router = Router();

/* ------------------ Multer Configuration for File Uploads ----------------- */
const uploadAudio = multer({ storage: createTempStorage('audio'), fileFilter: checkFileType('audio') });
const uploadImage = multer({
    storage: createTempStorage('images'),
    limits: { fileSize: 5242880 },
    fileFilter: checkFileType('image'),
});

/* ------------------------ Error Handling Middleware ----------------------- */
const uploadAudioMiddleware = createUploadMiddleware(uploadAudio.single('audio'));
const uploadImageMiddleware = createUploadMiddleware(uploadImage.single('cover'));

/* ----------------------------- Routes Setup ------------------------------ */
router.post('/extract-metadata', uploadAudioMiddleware, handleExtractMetadata);
router.post('/edit-metadata', uploadImageMiddleware, handleEditMetadata);
router.post('/convert-audio', uploadAudioMiddleware, handleConvertAudio);

export default router;