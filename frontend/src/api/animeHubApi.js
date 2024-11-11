import axios from 'axios'

// Helper to create a standardized error response
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

// Function to exchange the pin for an access token
export const exchangePin = async (pin) => {
    try {
        const response = await axios.post('/api/anime-hub/token', { pin })
        return { success: response.data.data }
    } catch (error) {
        return handleError('Something went wrong while exchanging the pin. Please try again later.', error)
    }
}

// Function to fetch user data
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

// Function to fetch user media list from AniList
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

// Function to get AniList IDs from MAL IDs in bulk
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

// Function to fetch user media list IDs from AniList
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

// Function to save media entry
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

// Function to toggle the favourite status of a media item
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

// Function to delete a media entry
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
