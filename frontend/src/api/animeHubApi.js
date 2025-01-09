import axios from 'axios'

import API_ROUTES from '../constants/apiRoutes'

/**
 * Handles API errors and returns a standardized error object.
 * @param {String} message The error message to display if the error is not a cancellation.
 * @param {Object} error The error object from the Axios request.
 * @returns {Object} An object containing the success status, error message, retry after seconds, and remaining rate limit.
 */
const handleError = (message, error) => {
    // Check if the error was due to cancellation
    if (axios.isCancel(error)) {
        return { success: false, message: 'Request canceled' }
    }
    console.log(error)

    return {
        success: false,
        message: error.response?.data?.message || `Oops! ${message}`,
        retryAfterSeconds: error?.response?.data?.retryAfterSeconds || 0,
        remainingRateLimit: error?.response?.data?.retryAfterSeconds ? 0 : error?.response?.data?.remainingRateLimit || 100,
    }
}

/**
 * Checks if the user is authenticated by making a request to the server.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = async (abortSignal) => {
    try {
        const result = await axios.post(API_ROUTES.ANIME_HUB.CHECK_AUTH, { withCredentials: true, signal: abortSignal })
        return result.data.success
    } catch (error) {
        return false
    }
}

/**
 * Logs the user out of their account.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Object} An object containing a boolean "success" property indicating if the logout was successful.
 */
export const logoutUser = async (abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.LOGOUT, { withCredentials: true, signal: abortSignal })
        return { success: response.data.success }
    } catch (error) {
        return handleError('Failed to log out. Please try again later.', error)
    }
}

/**
 * Exchanges an AniList authorization pin for an access token, then logs in the user.
 * @param {String} pin The authorization pin to exchange.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property.
 * If the exchange is successful, the "success" property is true and the user is logged in.
 * If the exchange fails, the "success" property is false and an error message is provided.
 */
export const exchangeCode = async (pin, abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.LOGIN, { pin }, { signal: abortSignal })
        if (!response.data.success) {
            return { success: false, message: response.data?.message }
        }

        return response.data
    } catch (error) {
        return handleError('Something went wrong while exchanging the pin. Please try again later.', error)
    }
}

/**
 * Fetches the user's data from the server.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "userData" property.
 * The "userData" property is an object containing the user's data, or undefined if the fetch fails.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserData = async (abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.USER_DATA, { withCredentials: true, signal: abortSignal })
        return {
            ...response.data,
        }
    } catch (error) {
        return handleError('Failed to load user data. Please refresh the page or try again.', error)
    }
}

/**
 * Fetches the user's media list from the server.
 * @param {String} mediaType The type of media to fetch (e.g. "ANIME" or "MANGA").
 * @param {Boolean} [favourite=false] Whether to fetch only favourite media.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "mediaList" property.
 * The "mediaList" property is an array of media entries or favourites, depending on the "favourite" parameter.
 * If the fetch is successful, the "success" property is true and the "mediaList" contains the data.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserMediaList = async (mediaType, favourite = false, abortSignal) => {
    try {
        if (!['ANIME', 'MANGA', 'FAVOURITES'].includes(mediaType)) {
            return { success: false, message: 'Invalid media type' }
        }
        let endpoint = API_ROUTES.ANIME_HUB.USER_MEDIA
        if (favourite) {
            endpoint = API_ROUTES.ANIME_HUB.FAVOURITE
        }
        const response = await axios.post(endpoint, { mediaType }, { withCredentials: true, signal: abortSignal })
        return {
            success: response.data.success,
            mediaList: response.data?.lists || response.data?.favourites || [],
        }
    } catch (error) {
        return handleError('Failed to load user media list. Please try again later.', error)
    }
}

/**
 * Fetches AniList IDs for a list of MAL IDs and a media type.
 * @param {String[]} malIds An array of MAL IDs to fetch AniList IDs for.
 * @param {String} mediaType The type of media to fetch AniList IDs for (e.g. "ANIME" or "MANGA").
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property, an "aniListIds" property,
 * a "remainingRateLimit" property and a "retryAfterSeconds" property.
 * The "aniListIds" property is an object mapping MAL IDs to their corresponding AniList IDs.
 * The "remainingRateLimit" property is the number of remaining requests in the rate limit.
 * The "retryAfterSeconds" property is the number of seconds to wait before retrying the request.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchAniListIds = async (malIds, mediaType, abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.ANILIST_IDS, { malIds, mediaType }, { signal: abortSignal })

        // Return AniList ID mapping and rate limit information
        return {
            success: response.data.success,
            aniListIds: response.data?.aniListIds,
            remainingRateLimit: response.data?.remainingRateLimit || 100,
            retryAfterSeconds: response.data?.retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Error fetching AniList IDs. Please try again later.', error)
    }
}

/**
 * Fetches a list of AniList IDs that the user has in their media list.
 * @param {String} mediaType The type of media to fetch IDs for (e.g. "ANIME" or "MANGA").
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "mediaListIDs" property.
 * The "mediaListIDs" property is an array of AniList IDs that the user has in their media list.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserMediaListIDs = async (mediaType, abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.USER_MEDIA_IDS, { mediaType }, { withCredentials: true, signal: abortSignal })
        return {
            success: response.data.success,
            mediaListIDs: response.data,
        }
    } catch (error) {
        return handleError('Failed to load user media IDs. Please try again later.', error)
    }
}

/**
 * Saves a media entry to the user's AniList media list.
 * @param {Number} mediaId The ID of the media to save.
 * @param {String} status The status of the media (e.g. "WATCHING", "COMPLETED", etc.).
 * @param {Number} [progress=0] The progress value to save (e.g. 0-10000).
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and rate limit information.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const saveMediaEntry = async (mediaId, status, progress = 0, abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.SAVE, { mediaId, status, progress }, { withCredentials: true, signal: abortSignal })

        // Return success status and rate limit information
        console.log(response.data)

        return {
            success: response.data.success,
            remainingRateLimit: response.data?.remainingRateLimit || 100,
            retryAfterSeconds: response.data?.retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Oops! We couldn’t save your media entry. Please try again later.', error)
    }
}

/**
 * Toggles the favourite status of a media item.
 * @param {Number} mediaId The ID of the media to toggle.
 * @param {String} mediaType The type of media to toggle (e.g. "ANIME" or "MANGA").
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "favouriteStatus" property.
 * The "favouriteStatus" property is a boolean indicating whether the media item is now favourited (true) or not (false).
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const toggleFavourite = async (mediaId, mediaType, abortSignal) => {
    try {
        const response = await axios.post(
            API_ROUTES.ANIME_HUB.TOGGLE_FAVOURITE,
            { mediaId, mediaType },
            { withCredentials: true, signal: abortSignal }
        )

        return {
            success: response.data.success,
            favouriteStatus: response.data,
        }
    } catch (error) {
        return handleError('Failed to toggle favourite status. Please try again later.', error)
    }
}

/**
 * Deletes a media entry from the user's AniList media list.
 * @param {Number} entryId The ID of the media entry to delete.
 * @param {AbortSignal} abortSignal The signal to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property.
 * If the request succeeds, the "success" property is true.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const deleteMediaEntry = async (entryId, abortSignal) => {
    try {
        const response = await axios.post(API_ROUTES.ANIME_HUB.DELETE, { entryId }, { withCredentials: true, signal: abortSignal })

        return {
            success: response.data,
        }
    } catch (error) {
        return handleError('Failed to delete media entry. Please try again later.', error)
    }
}
