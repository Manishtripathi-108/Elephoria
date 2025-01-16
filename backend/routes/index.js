import checkAllAuthStatus from '../middlewares/auth.middleware.js';
import anilistRoutes from './anilist.routes.js';
import audioRoutes from './audio.routes.js';
import logs from './logs.routes.js';
import spotifyRoutes from './spotify.routes.js';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Elephoria API!',
    });
});
router.post('/check-all-auth', checkAllAuthStatus);
router.use('/anilist', anilistRoutes);
router.use('/audio', audioRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/logs', logs);

export default router;
