// src/hooks/useUserMediaList.js
import { useCallback, useEffect, useState } from 'react'

import { fetchUserMediaList } from '../../../api/animeHubApi'

const useUserMediaList = (activeTab) => {
    const [mediaData, setMediaData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMediaData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Call API with the active tab for media type and favourite flag
            const result = await fetchUserMediaList(activeTab, activeTab === 'FAVOURITES')

            if (result.success) {
                setMediaData(result.mediaList)
            } else if (result.retryAfterSeconds > 0) {
                window.addToast(`Rate limit exceeded. Try again after ${result.retryAfterSeconds} seconds.`, 'error')
            } else {
                window.addToast(result.message, 'error')
            }
        } catch (error) {
            setError(error)
            window.addToast(`Error fetching ${activeTab.toLowerCase()} data.`, 'error', 10000)
            console.error(`Error fetching ${activeTab.toLowerCase()} data:`, error)
        } finally {
            setIsLoading(false)
        }
    }, [activeTab])

    useEffect(() => {
        if (['ANIME', 'MANGA', 'FAVOURITES'].includes(activeTab)) {
            fetchMediaData()
        }
    }, [activeTab, fetchMediaData])

    return { mediaData, isLoading, error }
}

export default useUserMediaList
