import { setSecureCookie } from '../utils/cookie.utils.js';
import { errorResponse, successResponse } from '../utils/response.utils.js';
import axios from 'axios';

export const spotifyGetAccessToken = async (req, res) => {
    const code = req.body.code;
    if (!code) {
        return errorResponse(res, 'Failed to Authorize with Spotify!', null, 400);
    }

    try {
        const authHeader = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64');

        // Exchange code for tokens
        const tokenResponse = await axios.post(
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

        if (tokenResponse.status !== 200) {
            return errorResponse(res, 'Failed to Authorize with Spotify!', null, 400);
        }

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        setSecureCookie(res, 'spotifyAccessToken', access_token, expires_in);
        setSecureCookie(res, 'spotifyRefreshToken', refresh_token);

        return successResponse(res);
    } catch (err) {
        return errorResponse(res, 'Failed to Authorize with Spotify!', err, 400);
    }
};
