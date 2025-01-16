import {
    fetchUserData,
    fetchUserMedia,
    fetchUserFavourites,
    fetchAniListIds,
    saveMediaEntry,
    toggleFavourite,
    deleteMediaEntry,
} from '../services/anilist.service.js';
import { successResponse, anilistErrorResponse } from '../utils/response.utils.js';

export const getUserData = async (req, res) => {
    try {
        const data = await fetchUserData(req.body.anilistAccessToken);
        return successResponse(res, data);
    } catch (error) {
        return anilistErrorResponse(res, 'Error fetching user data. Please try again later.', error);
    }
};

export const getUserMedia = async (req, res) => {
    try {
        const data = await fetchUserMedia(
            req.body.anilistAccessToken,
            req.body.anilistUserId,
            String(req.body.mediaType || 'ANIME').toUpperCase()
        );
        return successResponse(res, data);
    } catch (error) {
        return anilistErrorResponse(res, 'Error fetching user media. Please try again later.', error);
    }
};

export const getUserMediaIds = async (req, res) => {
    try {
        const data = await fetchUserMedia(
            req.body.anilistAccessToken,
            req.body.anilistUserId,
            String(req.body.mediaType || 'ANIME').toUpperCase(),
            true
        );
        return successResponse(res, data);
    } catch (error) {
        return anilistErrorResponse(res, 'Error fetching media IDs. Please try again later.', error);
    }
};

export const getUserFavourites = async (req, res) => {
    try {
        const data = await fetchUserFavourites(req.body.anilistAccessToken, req.body.anilistUserId);

        if (!data) {
            return res.status(404).json({ message: 'Favourites data not found' });
        }

        return successResponse(res, {
            mediaList: {
                anime: data.anime?.nodes || [],
                manga: data.manga?.nodes || [],
            },
        });
    } catch (error) {
        return anilistErrorResponse(res, 'Error retrieving favourites. Please try again later.', error);
    }
};

export const getAniListIds = async (req, res) => {
    try {
        const data = await fetchAniListIds(req.body.malIds, String(req.body.mediaType || 'ANIME').toUpperCase());

        const aniListIds = data.data.data.Page.media.reduce((acc, mediaItem) => {
            acc[mediaItem.idMal] = mediaItem.id;
            return acc;
        }, {});
        return successResponse(res, {
            aniListIds,
            retryAfterSeconds: data.headers['retry-after'],
            remainingRateLimit: data.headers['x-ratelimit-remaining'],
        });
    } catch (error) {
        return anilistErrorResponse(res, 'Error fetching AniList IDs for MAL IDs.', error);
    }
};

export const saveMedia = async (req, res) => {
    const status = req.body.status.toUpperCase();
    let progress = status === 'COMPLETED' ? 10000 : req.body.progress;

    try {
        const data = await saveMediaEntry(req.body.anilistAccessToken, req.body.mediaId, status, progress);
        return successResponse(res, {
            SaveMediaListEntry: data.data.data.SaveMediaListEntry,
            retryAfterSeconds: data.headers['retry-after'],
            remainingRateLimit: data.headers['x-ratelimit-remaining'],
        });
    } catch (error) {
        return anilistErrorResponse(res, 'Error saving media entry. Please try again later.', error);
    }
};

export const toggleFavouriteMedia = async (req, res) => {
    try {
        const data = await toggleFavourite(
            req.body.anilistAccessToken,
            req.body.mediaId,
            String(req.body.mediaType || 'ANIME').toLowerCase()
        );
        return successResponse(res, data);
    } catch (error) {
        return anilistErrorResponse(res, 'Error toggling favourite status. Please try again later.', error);
    }
};

export const deleteMedia = async (req, res) => {
    try {
        const data = await deleteMediaEntry(req.body.anilistAccessToken, req.body.entryId);
        return successResponse(res, data);
    } catch (error) {
        return anilistErrorResponse(res, 'Error deleting media entry. Please try again later.', error);
    }
};

export const logoutUser = (req, res) => {
    const { anilistAccessToken, anilistRefreshToken, aniListUserId } = req.cookies;

    if (!anilistAccessToken && !anilistRefreshToken && !aniListUserId) {
        return res.status(200).json({ message: 'Already logged out.' });
    }

    res.clearCookie('anilistAccessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.clearCookie('anilistRefreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.clearCookie('anilistUserId', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out successfully.' });
};
