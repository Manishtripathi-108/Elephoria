import {
    getToken,
    getUserData,
    getUserMedia,
    getUserMediaIds,
    getUserFavourites,
    getAniListIds,
    logoutUser,
    saveMedia,
    toggleFavouriteMedia,
    deleteMedia,
} from '../controllers/anime.controller.js';
import verifyAuth from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/login', getToken);
router.post('/check-auth', verifyAuth, (req, res) => res.status(200).json({ success: true }));
router.post('/user-data', verifyAuth, getUserData);
router.post('/user-media', verifyAuth, getUserMedia);
router.post('/user-media/ids', verifyAuth, getUserMediaIds);
router.post('/favourite', verifyAuth, getUserFavourites);
router.post('/anilist-ids', verifyAuth, getAniListIds);

router.post('/save', verifyAuth, saveMedia);
router.post('/toggle-favourite', verifyAuth, toggleFavouriteMedia);
router.post('/delete', verifyAuth, deleteMedia);
router.post('/logout', logoutUser);

export default router;
