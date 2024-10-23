import axios from 'axios'

// Helper to log errors more professionally
const logError = (message, error) => {
    const errorMessage = error.response?.data?.message || error.message || error.statusText
    console.error(`${message}: ${errorMessage}`)
}

// Helper to create a standardized error response
const getErrorResponse = (error) => {
    return {
        success: false,
        message: error.response?.data?.message || error.message || error.statusText,
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
        logError('Error exchanging pin', error)
        return getErrorResponse(error)
    }
}

// Function to get AniList IDs from MAL IDs in bulk
export const getAniListIds = async (malIds, mediaType) => {
    try {
        const response = await axios.post('/api/anime/anilist-ids', {
            malIds,
            mediaType: mediaType.toUpperCase(),
        })

        const { aniListIds, rateRemaining, retryAfter } = response.data

        // Return AniList ID mapping and rate limit information
        return {
            aniListIds,
            rateRemaining: rateRemaining || 100,
            retryAfter: retryAfter || 0,
        }
    } catch (error) {
        logError('Error fetching AniList IDs', error)
        return getErrorResponse(error)
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
        logError('Error adding media to AniList', error)
        return getErrorResponse(error)
    }
}
