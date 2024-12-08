const express = require("express");
const {
	getToken,
	getUserData,
	getUserMedia,
	getUserMediaIds,
	getUserFavourites,
	getAniListIds,
	logoutUser,
	saveMedia,
	toggleFavouriteMedia,
	deleteMedia,
} = require("../controllers/animeController");
const verifyAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", getToken);
router.post("/check-auth", verifyAuth, (req, res) =>
	res.status(200).json({ success: true })
);
router.post("/user-data", verifyAuth, getUserData);
router.post("/user-media", verifyAuth, getUserMedia);
router.post("/user-media/ids", verifyAuth, getUserMediaIds);
router.post("/favourite", verifyAuth, getUserFavourites);
router.post("/anilist-ids", verifyAuth, getAniListIds);

router.post("/save", verifyAuth, saveMedia);
router.post("/toggle-favourite", verifyAuth, toggleFavouriteMedia);
router.post("/delete", verifyAuth, deleteMedia);
router.post("/logout", logoutUser);

module.exports = router;
