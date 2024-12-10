import { Router } from "express";
import animeRoutes from "./animeRoutes.js";
import audioRoutes from "./audioRoutes.js";
import logs from "./logs.js";
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
