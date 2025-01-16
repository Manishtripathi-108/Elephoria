import { spotifyGetAccessToken } from '../controllers/spotify.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/login', spotifyGetAccessToken);

export default router;
