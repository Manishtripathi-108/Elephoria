const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

// Import handlers
const { uploadAudio } = require("./audioHandlers/uploadAudio");
const { editMetadata } = require("./audioHandlers/editMetadata");
const getJson = require("./anime/getJson");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

/* ------------------------------- Middleware ------------------------------- */
app.use(cors());
app.use(express.json());

/* ------------------ Serve Static Files for Uploaded Images ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
app.get("/api", (req, res) => {
	res.send("Hello from Backend!");
});

// Route to upload audio and extract metadata
app.post("/api/upload", upload.single("audio"), uploadAudio);

// Endpoint for editing metadata
app.post("/api/edit-metadata", upload.single("audio"), editMetadata);

app.get("/api/json", getJson);

/* ------------------------------- Anilist API ------------------------------ */
// Import Anilist API handler
const {
	getAnimeList,
	exchangePinForToken,
	fetchUserData,
	fetchUserMediaAndFavorites,
} = require("./anime/anilist");

// Route to fetch anime list from Anilist API
app.post("/api/anime", getAnimeList);

app.post("/api/anime/exchange-pin", exchangePinForToken);

app.post("/api/anime/user-data", fetchUserData);

app.post("/api/anime/user-all-media", fetchUserMediaAndFavorites);

// Set PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port: http://localhost:${PORT}`);
});
