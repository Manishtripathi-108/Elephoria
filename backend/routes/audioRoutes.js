const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
	uploadAudioHandler,
	editMetadataHandler,
} = require("../controllers/audioController");

/* ------------------ Multer configuration for file uploads ----------------- */
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${new Date().toISOString().replace(/:/g, "-")}-${
				file.originalname
			}`
		);
	},
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("audio"), uploadAudioHandler);
router.post("/edit-metadata", editMetadataHandler);

module.exports = router;
