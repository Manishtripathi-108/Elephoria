const express = require("express");
const animeRoutes = require("./animeRoutes");
const audioRoutes = require("./audioRoutes");
const logs = require("./logs");
const router = express.Router();

router.use("/anime-hub", animeRoutes);
router.use("/audio", audioRoutes);
router.use("/logs", logs);

module.exports = router;
