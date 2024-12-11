import { Router } from "express";
import animeRoutes from "./anime.routes.js";
import audioRoutes from "./audio.routes.js";
import logs from "./logs.routes.js";
const router = Router();

router.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Welcome to the Elephoria API!",
	});
});
router.use("/anime-hub", animeRoutes);
router.use("/audio", audioRoutes);
router.use("/logs", logs);

export default router;
