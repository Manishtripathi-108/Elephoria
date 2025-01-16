import { setSecureCookie } from '../utils/cookie.utils.js';
import { backendLogger } from '../utils/logger.utils.js';
import { errorResponse, successResponse } from '../utils/response.utils.js';
import axios from 'axios';

/* --------------------------------- Helper --------------------------------- */
const handleTokenResponse = (res, tokenRes, type) => {
    if (tokenRes.status !== 200) {
        return errorResponse(res, `Failed to Authorize with ${type}!`, tokenRes, 400);
    }

    backendLogger.info(`Received ${type} token`, tokenRes.data);

    if (tokenRes.data.access_token) {
        if (type === 'anilist') {
            tokenRes.data.expires_in = parseInt(tokenRes.data.expires_in) / 1000;
        }
        setSecureCookie(res, `${type}AccessToken`, tokenRes.data.access_token, tokenRes.data.expires_in);
        setSecureCookie(res, `${type}RefreshToken`, tokenRes.data.refresh_token);

        return successResponse(res);
    } else {
        return errorResponse(res, `Failed to Authorize with ${type}!`, tokenRes, 400);
    }
};

/* -------------------------------------------------------------------------- */
/*                              Get Access Tokens                             */
/* -------------------------------------------------------------------------- */
export const anilistGetAccessToken = async (req, res) => {
    const code = req.body?.code;
    if (!code) {
        return errorResponse(res, 'Failed to Authorize with AniList!', null, 400);
    }
    try {
        const response = await axios.post('https://anilist.co/api/v2/oauth/token', {
            grant_type: 'authorization_code',
            client_id: process.env.ANILIST_CLIENT_ID,
            client_secret: process.env.ANILIST_CLIENT_SECRET,
            redirect_uri: process.env.ANILIST_REDIRECT_URI,
            code: code,
        });

        return handleTokenResponse(res, response, 'anilist');
    } catch (error) {
        return errorResponse(res, 'Failed to Authorize with AniList!', error, 400);
    }
};

export const spotifyGetAccessToken = async (req, res) => {
    const code = req.body?.code;
    if (!code) {
        return errorResponse(res, 'Failed to Authorize with Spotify!', null, 400);
    }

    try {
        const authHeader = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64');

        // Exchange code for tokens
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authHeader}`,
                },
            }
        );

        return handleTokenResponse(res, response, 'spotify');
    } catch (err) {
        return errorResponse(res, 'Failed to Authorize with Spotify!', err, 400);
    }
};

/* -------------------------------------------------------------------------- */
/*                            Refresh Access Tokens                           */
/* -------------------------------------------------------------------------- */
export const refreshAniListToken = async (req, res) => {
    const refreshToken = req.cookies?.anilistRefreshToken;

    if (!refreshToken) {
        return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);
    }

    try {
        const response = await axios.post('https://anilist.co/api/v2/oauth/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.ANILIST_CLIENT_ID,
            client_secret: process.env.ANILIST_CLIENT_SECRET,
        });

        return handleTokenResponse(res, response, 'anilist');
    } catch (error) {
        return errorResponse(res, 'Unauthorized: Please log in again.', error, 401);
    }
};
