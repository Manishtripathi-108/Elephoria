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
        return handleError('Error adding media to AniList', error)
    }
}
