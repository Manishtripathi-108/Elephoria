const express = require("express");
const animeRoutes = require("./animeRoutes");
const audioRoutes = require("./audioRoutes");

const router = express.Router();

router.use("/anime-hub", animeRoutes);
router.use("/audio", audioRoutes);

module.exports = router;
