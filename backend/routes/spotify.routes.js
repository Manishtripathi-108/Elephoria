import { refreshSpotifyToken, spotifyGetAccessToken } from '../controllers/auth.controller.js';
import { verifySpotifyAuth } from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/login', spotifyGetAccessToken);
router.post('/refresh-token', refreshSpotifyToken);
router.post('/check-auth', verifySpotifyAuth, (req, res) => res.status(200).json({ success: true }));

export default router;
