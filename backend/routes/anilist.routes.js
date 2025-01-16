import {
    getUserData,
    getUserMedia,
    getUserMediaIds,
    getUserFavourites,
    getAniListIds,
    logoutUser,
    saveMedia,
    toggleFavouriteMedia,
    deleteMedia,
} from '../controllers/anilist.controller.js';
import { anilistGetAccessToken, refreshAniListToken } from '../controllers/auth.controller.js';
import { verifyAnilistAuth } from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/login', anilistGetAccessToken);
router.post('/refresh-token', refreshAniListToken);
router.post('/check-auth', verifyAnilistAuth, (req, res) => res.status(200).json({ success: true }));

router.post('/user-data', verifyAnilistAuth, getUserData);
router.post('/user-media', verifyAnilistAuth, getUserMedia);
router.post('/user-media-ids', verifyAnilistAuth, getUserMediaIds);
router.post('/favourite', verifyAnilistAuth, getUserFavourites);
router.post('/anilist-ids', verifyAnilistAuth, getAniListIds);

router.post('/save', verifyAnilistAuth, saveMedia);
router.post('/toggle-favourite', verifyAnilistAuth, toggleFavouriteMedia);
router.post('/delete', verifyAnilistAuth, deleteMedia);
router.post('/logout', logoutUser);

export default router;
