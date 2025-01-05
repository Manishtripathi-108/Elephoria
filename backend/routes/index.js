import refreshAllTokens from '../services/refreshAllTokens.service.js';
import animeRoutes from './anime.routes.js';
import audioRoutes from './audio.routes.js';
import logs from './logs.routes.js';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Elephoria API!',
    });
});
router.post('/token', refreshAllTokens);
router.use('/anime-hub', animeRoutes);
router.use('/audio', audioRoutes);
router.use('/logs', logs);

export default router;
