import axios from 'axios'

// Helper to create a standardized error response
const handleError = (message, error) => {
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
        const response = await axios.post('/api/anime-hub/exchange-pin', { pin })
        return { success: response.data.success }
    } catch (error) {
        return handleError('Something went wrong while exchanging the pin. Please try again later.', error)
    }
}

// Function to fetch user data
export const fetchUserData = async () => {
    try {
        const response = await axios.post('/api/anime-hub/user-data', { withCredentials: true })
        return {
            success: !!response.data.userData,
            userData: response.data.userData,
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
            endpoint = '/api/anime-hub/user-favourites'
        }
        const response = await axios.post(endpoint, { mediaType }, { withCredentials: true })

        return {
            success: !!response.data.mediaList || !!response.data.favourites,
            mediaList: response.data.mediaList?.lists || response.data.favourites || [],
        }
    } catch (error) {
        return handleError('Failed to load user media list. Please try again later.', error)
    }
}

// Function to get AniList IDs from MAL IDs in bulk
export const fetchAniListIds = async (malIds, mediaType) => {
    try {
        const response = await axios.post('/api/anime-hub/anilist-ids', { malIds, mediaType })

        const { aniListIds, remainingRateLimit, retryAfterSeconds } = response.data

        // Return AniList ID mapping and rate limit information
        return {
            success: !!aniListIds,
            aniListIds,
            remainingRateLimit: remainingRateLimit || 100,
            retryAfterSeconds: retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Error fetching AniList IDs. Please try again later.', error)
    }
}

// Function to fetch user media list IDs from AniList
export const fetchUserMediaListIDs = async (mediaType) => {
    try {
        const response = await axios.post('/api/anime-hub/user-media-ids', { mediaType }, { withCredentials: true })
        return {
            success: !!response.data.mediaListIDs,
            mediaListIDs: response.data.mediaListIDs,
        }
    } catch (error) {
        return handleError('Failed to load user media IDs. Please try again later.', error)
    }
}

// Function to save media entry
export const saveMediaEntry = async (mediaId, status, progress = 0) => {
    try {
        const response = await axios.post('/api/anime-hub/save-media-entry', { mediaId, status, progress }, { withCredentials: true })
        const { SaveMediaListEntry, remainingRateLimit, retryAfterSeconds } = response.data

        // Return success status and rate limit information
        return {
            success: SaveMediaListEntry.status === status,
            remainingRateLimit: remainingRateLimit || 100,
            retryAfterSeconds: retryAfterSeconds || 0,
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
            success: mediaId === response.data.mediaId,
            favouriteStatus: response.data.isFavourite,
        }
    } catch (error) {
        return handleError('', error)
    }
}

// Function to delete a media entry
export const deleteMediaEntry = async (entryId) => {
    try {
        const response = await axios.post('/api/anime-hub/delete-media-entry', { entryId }, { withCredentials: true })

        return {
            success: response.data.deleted,
        }
    } catch (error) {
        return handleError('Failed to delete media entry. Please try again later.', error)
    }
}
