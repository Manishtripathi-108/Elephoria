const express = require("express");
const animeRoutes = require("./animeRoutes");
const audioRoutes = require("./audioRoutes");
const logs = require("./logs");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ success: true });
});
router.use("/anime-hub", animeRoutes);
router.use("/audio", audioRoutes);
router.use("/logs", logs);

module.exports = router;
