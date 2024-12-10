import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import {
	uploadAudioHandler,
	editMetadataHandler,
} from "../controllers/audioController.js";

/* ------------------ Multer configuration for file uploads ----------------- */
const storage = diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/audio/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("audio"), uploadAudioHandler);
router.post("/edit-metadata", editMetadataHandler);

export default router;
