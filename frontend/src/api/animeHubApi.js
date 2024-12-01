import axios from 'axios'

/**
 * Handles API errors and returns a standardized error object.
 * @param {String} message The error message to display if the error is not a cancellation.
 * @param {Object} error The error object from the Axios request.
 * @returns {Object} An object containing the success status, error message, retry after seconds, and remaining rate limit.
 */
const handleError = (message, error) => {
    // Check if the error was due to cancellation
    if (axios.isCancel(error)) {
        console.error('Request canceled:', error.message)
        return { success: false, message: 'Request canceled' }
    }

    console.error(message, error)
    return {
        success: false,
        message: error.response?.data?.message || `Oops! ${message}`,
        retryAfterSeconds: error?.response?.data?.retryAfterSeconds || 0,
        remainingRateLimit: error?.response?.data?.retryAfterSeconds ? 0 : error?.response?.data?.remainingRateLimit || 100,
    }
}

/**
 * Checks if the user is authenticated by making a request to the server.
 * @returns {Boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = async () => {
    try {
        const result = await axios.post('/api/anime-hub/check-auth', { withCredentials: true })
        return result.data.success
    } catch (error) {
        return false
    }
}

/**
 * Logs the user out of their account.
 * @returns {Object} An object containing a boolean "success" property indicating if the logout was successful.
 */
export const logoutUser = async () => {
    try {
        const response = await axios.post('/api/anime-hub/logout', { withCredentials: true })
        return { success: response.data.success }
    } catch (error) {
        return handleError('Failed to log out. Please try again later.', error)
    }
}

/**
 * Exchanges an AniList authorization pin for an access token, then logs in the user.
 * @param {String} pin The authorization pin to exchange.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property.
 * If the exchange is successful, the "success" property is true and the user is logged in.
 * If the exchange fails, the "success" property is false and an error message is provided.
 */
export const exchangePin = async (pin) => {
    try {
        const response = await axios.post('/api/anime-hub/login', { pin })
        return { success: response.data.data }
    } catch (error) {
        return handleError('Something went wrong while exchanging the pin. Please try again later.', error)
    }
}

/**
 * Fetches the user's data from the server.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "userData" property.
 * The "userData" property is an object containing the user's data, or undefined if the fetch fails.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserData = async () => {
    try {
        const response = await axios.post('/api/anime-hub/user-data', { withCredentials: true })
        return {
            success: response.data.success,
            userData: response.data.data,
        }
    } catch (error) {
        return handleError('Failed to load user data. Please refresh the page or try again.', error)
    }
}

/**
 * Fetches the user's media list from the server.
 * @param {String} mediaType The type of media to fetch (e.g. "ANIME" or "MANGA").
 * @param {Boolean} [favourite=false] Whether to fetch only favourite media.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "mediaList" property.
 * The "mediaList" property is an array of media entries or favourites, depending on the "favourite" parameter.
 * If the fetch is successful, the "success" property is true and the "mediaList" contains the data.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserMediaList = async (mediaType, favourite = false) => {
    try {
        let endpoint = '/api/anime-hub/user-media'
        if (favourite) {
            endpoint = '/api/anime-hub/favourite'
        }
        const response = await axios.post(endpoint, { mediaType }, { withCredentials: true })

        return {
            success: response.data.success,
            mediaList: response.data.data?.lists || response.data.data.favourites || [],
        }
    } catch (error) {
        return handleError('Failed to load user media list. Please try again later.', error)
    }
}

/**
 * Fetches AniList IDs for a list of MAL IDs and a media type.
 * @param {String[]} malIds An array of MAL IDs to fetch AniList IDs for.
 * @param {String} mediaType The type of media to fetch AniList IDs for (e.g. "ANIME" or "MANGA").
 * @param {Object} [cancelToken] A cancel token to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property, an "aniListIds" property,
 * a "remainingRateLimit" property and a "retryAfterSeconds" property.
 * The "aniListIds" property is an object mapping MAL IDs to their corresponding AniList IDs.
 * The "remainingRateLimit" property is the number of remaining requests in the rate limit.
 * The "retryAfterSeconds" property is the number of seconds to wait before retrying the request.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchAniListIds = async (malIds, mediaType, cancelToken) => {
    try {
        const response = await axios.post('/api/anime-hub/anilist-ids', { malIds, mediaType }, { cancelToken })

        // Return AniList ID mapping and rate limit information
        return {
            success: response.data.success,
            aniListIds: response.data.data.aniListIds,
            remainingRateLimit: response.data.data.remainingRateLimit || 100,
            retryAfterSeconds: response.data.data.retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Error fetching AniList IDs. Please try again later.', error)
    }
}

/**
 * Fetches a list of AniList IDs that the user has in their media list.
 * @param {String} mediaType The type of media to fetch IDs for (e.g. "ANIME" or "MANGA").
 * @param {Object} [cancelToken] A cancel token to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "mediaListIDs" property.
 * The "mediaListIDs" property is an array of AniList IDs that the user has in their media list.
 * If the fetch fails, the "success" property is false and an error message is provided.
 */
export const fetchUserMediaListIDs = async (mediaType, cancelToken) => {
    try {
        const response = await axios.post('/api/anime-hub/user-media/ids', { mediaType }, { cancelToken }, { withCredentials: true })
        return {
            success: response.data.success,
            mediaListIDs: response.data.data,
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
 * @param {Object} [cancelToken] A cancel token to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and rate limit information.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const saveMediaEntry = async (mediaId, status, progress = 0, cancelToken) => {
    try {
        const response = await axios.post('/api/anime-hub/save', { mediaId, status, progress }, { cancelToken }, { withCredentials: true })

        // Return success status and rate limit information
        return {
            success: response.data.success,
            remainingRateLimit: response.data.data.remainingRateLimit || 100,
            retryAfterSeconds: response.data.data.retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Oops! We couldn’t save your media entry. Please try again later.', error)
    }
}

/**
 * Toggles the favourite status of a media item.
 * @param {Number} mediaId The ID of the media to toggle.
 * @param {String} mediaType The type of media to toggle (e.g. "ANIME" or "MANGA").
 * @param {Object} [cancelToken] A cancel token to abort the request.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property and a "favouriteStatus" property.
 * The "favouriteStatus" property is a boolean indicating whether the media item is now favourited (true) or not (false).
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const toggleFavourite = async (mediaId, mediaType) => {
    try {
        const response = await axios.post('/api/anime-hub/toggle-favourite', { mediaId, mediaType }, { withCredentials: true })

        return {
            success: response.data.success,
            favouriteStatus: response.data.data,
        }
    } catch (error) {
        return handleError('Failed to toggle favourite status. Please try again later.', error)
    }
}

/**
 * Deletes a media entry from the user's AniList media list.
 * @param {Number} entryId The ID of the media entry to delete.
 * @returns {Promise<Object>} A promise that resolves to an object with a "success" property.
 * If the request succeeds, the "success" property is true.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const deleteMediaEntry = async (entryId) => {
    try {
        const response = await axios.post('/api/anime-hub/delete', { entryId }, { withCredentials: true })

        return {
            success: response.data.data,
        }
    } catch (error) {
        return handleError('Failed to delete media entry. Please try again later.', error)
    }
}
