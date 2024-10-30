const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import handlers
const { uploadAudio } = require("./audioHandlers/uploadAudio");
const { editMetadata } = require("./audioHandlers/editMetadata");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

/* ------------------------------- Middleware ------------------------------- */
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

/* ------------------------------- Anilist API ------------------------------ */
// Import Anilist API handler
const {
	fetchAnimeList,
	exchangePinForToken,
	fetchUserId,
	fetchUserData,
	fetchUserMediaDetails,
	fetchUserMediaIDs,
	fetchUserFavourites,
	fetchAniListIds,
	saveMediaEntry,
	toggleFavourite,
} = require("./animeHub/anilist");

// Middleware to check token and fetch user ID if not present
const verifyAuth = async (req, res, next) => {
	const token = req.cookies.accessToken; // Access the token from cookies
	let userId = req.cookies.userId; // Access the userId from cookies

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized: Please log in again, token not found.",
		});
	}

	if (!userId) {
		try {
			// Fetch the user ID
			const response = await fetchUserId(token);
			userId = response;
			console.log("User ID fetched: ", userId);

			if (!userId) {
				return res.status(401).json({
					message:
						"Unauthorized: Please log in again, user ID not found.",
				});
			}

			// Set the user ID cookie for the frontend
			res.cookie("userId", userId, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			});
		} catch (error) {
			return res.status(500).json({
				message:
					"Failed to fetch user ID. Please reload the page or log in again.",
				error,
			});
		}
	}

	// Attach userId to the req object for access in subsequent middleware/route handlers
	req.userId = userId;

	next();
};

// Route to fetch anime list from Anilist API
app.post("/api/anime-hub", verifyAuth, fetchAnimeList);

app.post("/api/anime-hub/exchange-pin", exchangePinForToken);

app.post("/api/anime-hub/user-data", verifyAuth, fetchUserData);

app.post("/api/anime-hub/user-media", verifyAuth, fetchUserMediaDetails);

app.post("/api/anime-hub/user-media-ids", verifyAuth, fetchUserMediaIDs);

app.post("/api/anime-hub/user-favourites", verifyAuth, fetchUserFavourites);

app.post("/api/anime-hub/anilist-ids", verifyAuth, fetchAniListIds);

app.post("/api/anime-hub/save-media-entry", verifyAuth, saveMediaEntry);

app.post("/api/anime-hub/toggle-favourite", verifyAuth, toggleFavourite);

// Set PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port: http://localhost:${PORT}`);
});
