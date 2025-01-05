import { errorResponse, successResponse } from '../utils/response.utils.js';
import { renewAniListToken } from './anime.service.js';

/**
 * Sets a secure HTTP-only cookie for tokens.
 * @param {Response} res - Express response object.
 * @param {string} name - Name of the cookie.
 * @param {string} value - Value of the cookie.
 * @param {number} maxAge - Maximum age in milliseconds.
 */
const setSecureCookie = (res, name, value, maxAge = 7 * 24 * 60 * 60 * 1000) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge,
    });
};

/**
 * Renews a token and updates the response cookies.
 * @param {string} token - The refresh token to use for renewal.
 * @param {Function} renewFunction - Function to call for renewing the token.
 * @param {Response} res - Express response object.
 * @param {string} cookieName - The name of the cookie storing the refresh token.
 * @param {string} tokenType - Type of token (e.g., 'app' or 'anilist').
 * @returns {Promise<{accessToken: string, expiresIn: number} | null>} - Renewed access token and expiry.
 */
const renewToken = async (token, renewFunction, res, cookieName, tokenType) => {
    try {
        const result = await renewFunction(token);

        // Update the refresh token cookie
        setSecureCookie(res, cookieName, result.refresh_token);

        return {
            accessToken: result.access_token,
            expiresIn: result.expires_in,
        };
    } catch (error) {
        console.error(`Error renewing ${tokenType} token:`, error.message);
        return null;
    }
};

/**
 * Renews all access tokens and updates the response cookies.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - Response with renewed access tokens and expiry.
 */
const refreshAllTokens = async (req, res) => {
    try {
        console.log('Refreshing all tokens...');
        const { appRefreshToken, anilistRefreshToken } = req.cookies;

        const tokens = {};

        // Renew app token if present
        if (appRefreshToken) {
            // const appTokenData = await renewToken(appRefreshToken, renewAppToken, res, 'appRefreshToken', 'app');
            // if (appTokenData) {
            //     tokens.appAccessToken = appTokenData.accessToken;
            //     tokens.appTokenExpiresIn = appTokenData.expiresIn;
            // }
        }

        // Renew AniList token if present
        if (anilistRefreshToken) {
            const anilistTokenData = await renewToken(
                anilistRefreshToken,
                renewAniListToken,
                res,
                'anilistRefreshToken',
                'AniList'
            );
            if (anilistTokenData) {
                tokens.anilistAccessToken = anilistTokenData.accessToken;
                tokens.anilistAccessTokenExpiresIn = anilistTokenData.expiresIn;
            }
        }

        return successResponse(res, tokens);
    } catch (error) {
        return errorResponse(res);
    }
};

export default refreshAllTokens;
