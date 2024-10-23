import axios from 'axios'

// Helper to create a standardized error response
const handleError = (message, error) => {
    console.error(error.response?.data)

    return {
        success: false,
        message: error.response?.data?.message || error.message,
        retryAfter: error?.response?.data?.retryAfter || 0,
        rateRemaining: error?.response?.data?.retryAfter ? 0 : error?.response?.data?.rateRemaining || 100,
    }
}

// Function to exchange the pin for an access token
export const exchangePin = async (pin) => {
    try {
        const response = await axios.post('/api/anime/exchange-pin', { pin })
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
        const response = await axios.post('/api/anime/anilist-ids', { malIds, mediaType })

        const { aniListIds, rateRemaining, retryAfter } = response.data

        // Return AniList ID mapping and rate limit information
        return {
            success: !!aniListIds,
            aniListIds,
            rateRemaining: rateRemaining || 100,
            retryAfter: retryAfter || 0,
        }
    } catch (error) {
        return handleError('Error fetching AniList IDs', error)
    }
}

export const getUserMediaListIDs = async (accessToken, mediaType) => {
    try {
        const response = await axios.post('/api/anime/user-media-ids', { accessToken, mediaType })
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
        const response = await axios.post('/api/anime/add-to-anilist', {
            accessToken,
            mediaId: aniListId,
            status,
        })

        const { SaveMediaListEntry, rateRemaining, retryAfter } = response.data

        // Return success status and rate limit information
        return {
            success: SaveMediaListEntry.status === status,
            rateRemaining: rateRemaining || 100,
            retryAfter: retryAfter || 0,
        }
    } catch (error) {
        return handleError('Error adding media to AniList', error)
    }
}
