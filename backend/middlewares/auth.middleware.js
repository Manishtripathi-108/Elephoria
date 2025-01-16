import { fetchUserId } from '../services/anilist.service.js';
import { errorResponse, successResponse } from '../utils/response.utils.js';
import jwt from 'jsonwebtoken';

const verifyToken = (token, clientId, tokenType) => {
    if (!token) throw new Error(`${tokenType} token missing.`);
    const decoded = jwt.decode(token);
    if (!decoded) throw new Error(`${tokenType} token is invalid.`);
    if (decoded.exp < Math.floor(Date.now() / 1000)) throw new Error(`${tokenType} token has expired.`);
    if (!decoded.aud || decoded.aud !== clientId) throw new Error(`${tokenType} token audience mismatch.`);
    return decoded;
};

export const verifyAnilistAuth = async (req, res, next) => {
    console.log('Verifying anime auth...');
    try {
        const token = req.cookies?.anilistAccessToken;
        if (!token) return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);

        const decoded = verifyToken(token, process.env.ANILIST_CLIENT_ID, 'Anilist');

        let userId = decoded.sub;
        if (!userId) {
            userId = await fetchUserId(token);
            if (!userId) throw new Error("Couldn't fetch Anilist user ID.");
        }

        // Attach user details to request
        req.body.anilistUserId = userId;
        req.body.anilistAccessToken = token;
        next();
    } catch (error) {
        console.error('Anilist auth verification error:', error);
        return errorResponse(res, 'Unauthorized: Please log in again.', error.message, 401);
    }
};

export const verifySpotifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.spotifyAccessToken;
        if (!token) return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);

        verifyToken(token, process.env.SPOTIFY_CLIENT_ID, 'Spotify');

        // Attach token to request
        req.body.spotifyAccessToken = token;
        next();
    } catch (error) {
        console.error('Spotify auth verification error:', error);
        return errorResponse(res, 'Unauthorized: Please log in again.', error.message, 401);
    }
};

export const checkAllAuthStatus = async (req, res) => {
    const anilistToken = req.cookies?.anilistAccessToken;
    const spotifyToken = req.cookies?.spotifyAccessToken;

    const Auth = {
        anilist: false,
        spotify: false,
    };

    try {
        if (anilistToken) {
            verifyToken(anilistToken, process.env.ANILIST_CLIENT_ID, 'Anilist');
            Auth.anilist = true;
        }

        if (spotifyToken) {
            verifyToken(spotifyToken, process.env.SPOTIFY_CLIENT_ID, 'Spotify');
            Auth.spotify = true;
        }
    } catch (error) {
        console.error('Error during authentication status check:', error.message);
    }

    return successResponse(res, Auth);
};

export default checkAllAuthStatus;
