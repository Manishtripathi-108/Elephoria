import axios from 'axios'

// Helper to create a standardized error response
const handleError = (message, error) => {
    console.error(error.response?.data)

    return {
        success: false,
        message: error.response?.data?.message || error.message,
        retryAfterSeconds: error?.response?.data?.retryAfterSeconds || 0,
        remainingRateLimit: error?.response?.data?.retryAfterSeconds ? 0 : error?.response?.data?.remainingRateLimit || 100,
    }
}

// Function to exchange the pin for an access token
export const exchangePin = async (pin) => {
    try {
        const response = await axios.post('/api/anime-hub/exchange-pin', { pin })
        return {
            success: !!response.data.accessToken,
            token: response.data.accessToken,
        }
    } catch (error) {
        return handleError('Error exchanging pin', error)
    }
}

// Function to get user media data from AniList
export const getUserMediaList = async (accessToken, mediaType, favorite = false) => {
    try {
        let endpoint = '/api/anime-hub/user-media'
        if (favorite) {
            endpoint = '/api/anime-hub/user-favorites'
        }

        const response = await axios.post(endpoint, { accessToken, mediaType })
        return {
            success: !!response.data.mediaList || !!response.data.favorites,
            mediaList: response.data.mediaList?.lists || response.data.favorites || [],
        }
    } catch (error) {
        return handleError('Error fetching user media list', error)
    }
}

// Function to get AniList IDs from MAL IDs in bulk
export const getAniListIds = async (malIds, mediaType) => {
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
        return handleError('Error fetching AniList IDs', error)
    }
}

// Function to get user media data from AniList
export const getUserMediaListIDs = async (accessToken, mediaType) => {
    try {
        const response = await axios.post('/api/anime-hub/user-media-ids', { accessToken, mediaType })
        return {
            success: !!response.data.mediaListIDs,
            mediaListIDs: response.data.mediaListIDs,
        }
    } catch (error) {
        return handleError('Error fetching user media IDs', error)
    }
}

// Function to add media to AniList
export const addToAniList = async (accessToken, aniListId, status) => {
    try {
        const response = await axios.post('/api/anime-hub/add-to-anilist', {
            accessToken,
            mediaId: aniListId,
            status,
        })

        const { SaveMediaListEntry, remainingRateLimit, retryAfterSeconds } = response.data

        // Return success status and rate limit information
        return {
            success: SaveMediaListEntry.status === status,
            remainingRateLimit: remainingRateLimit || 100,
            retryAfterSeconds: retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Error adding media to AniList:', error)
    }
}

// Function to Edit Media Entry
export const editMediaEntry = async (accessToken, mediaId, status, progress) => {
    if (!mediaId || mediaId === '') {
        return -1
    }

    try {
        const response = await axios.post('/api/anime-hub/edit-media-entry', {
            accessToken,
            mediaId,
            progress,
            status,
        })

        const { SaveMediaListEntry, remainingRateLimit, retryAfterSeconds } = response.data

        return {
            success: !!SaveMediaListEntry.status,
            remainingRateLimit: remainingRateLimit || 100,
            retryAfterSeconds: retryAfterSeconds || 0,
        }
    } catch (error) {
        return handleError('Error Editing Media:', error)
    }
}
