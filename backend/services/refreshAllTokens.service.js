import { setSecureCookie } from '../utils/cookie.utils.js';
import { backendLogger } from '../utils/logger.utils.js';
import { errorResponse, successResponse } from '../utils/response.utils.js';
import { renewAniListToken } from './anime.service.js';

/**
 * Renews a token and stores the new tokens in secure cookies.
 * @param {Object} res - The response object.
 * @param {string} token - The token to renew.
 * @param {Function} renewFunction - The function to call to renew the token.
 * @param {string} tokenType - The type of the token to renew. Example: 'anilist', 'app'.
 * @returns {Promise<true|null>} - true if the token was renewed, null otherwise.
 */
const renewToken = async (res, token, renewFunction, tokenType) => {
    try {
        tokenType = tokenType.toLowerCase();
        const result = await renewFunction(token);
        setSecureCookie(res, `${tokenType}AccessToken`, result.access_token, result.expires_in);
        setSecureCookie(res, `${tokenType}RefreshToken`, result.refresh_token);
        return true;
    } catch (error) {
        console.error(`Error renewing ${tokenType} token:`, error);
        return null;
    }
};

/**
 * Refresh all tokens present in the request cookies.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const refreshAllTokens = async (req, res) => {
    try {
        console.log('Refreshing all tokens...');
        const { appRefreshToken, anilistRefreshToken } = req.cookies;

        // Renew app token if present
        if (appRefreshToken) {
            // await renewToken(res, appRefreshToken, renewAppToken, 'App');
        }

        // Renew AniList token if present
        if (anilistRefreshToken) {
            await renewToken(res, anilistRefreshToken, renewAniListToken, 'AniList');
        }

        return successResponse(res);
    } catch (error) {
        return errorResponse(res);
    }
};

export const refreshAnilistToken = async (req, res) => {
    try {
        console.log('Refreshing AniList token...');
        const { anilistRefreshToken } = req.cookies;

        if (!anilistRefreshToken) {
            return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);
        }

        const response = await renewAniListToken(anilistRefreshToken);

        if (!response || response?.status === 401) {
            return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);
        }

        setSecureCookie(res, 'anilistAccessToken', response.access_token, response.expires_in);
        setSecureCookie(res, 'anilistRefreshToken', response.refresh_token);

        backendLogger.info('Renewed AniList token', {
            refreshToken: anilistRefreshToken,
        });

        return successResponse(res);
    } catch (error) {
        if (error.status === 401) {
            return errorResponse(res, 'Unauthorized: Please log in again.', null, 401);
        }
        return errorResponse(res, error);
    }
};

export default refreshAllTokens;
