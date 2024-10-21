// api.js
import axios from 'axios'

// Function to get AniList IDs from MAL IDs in bulk
export const getAniListIds = async (malIds, mediaType) => {
    try {
        const response = await axios.post('/api/anime/anilist-ids', {
            malIds,
            mediaType: mediaType.toUpperCase(),
        })
        return response.data.aniListIds // Map of MAL ID -> AniList ID
    } catch (error) {
        console.error('Error fetching AniList IDs:', error.response?.data || error.statusText)
        return null
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

        return {
            success: SaveMediaListEntry.status === status,
            rateRemaining: rateRemaining || 100,
            retryAfter: retryAfter || 0,
        }
    } catch (error) {
        console.error('Error adding to AniList:', error.response?.data || error.statusText)
        return {
            success: false,
            rateRemaining: 0,
            retryAfter: error?.response?.data?.retryAfter || 0,
        }
    }
}
