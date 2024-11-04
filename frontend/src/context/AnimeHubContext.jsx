import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { fetchUserMediaList } from '../api/animeHubApi'

const AnimeHubContext = createContext()

export const useAnimeHubContext = () => useContext(AnimeHubContext)

export const AnimeHubProvider = ({ children }) => {
    const [mediaData, setMediaData] = useState([])
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMediaData = useCallback(
        async (reload = false) => {
            setIsLoading(reload)
            setError(null)

            try {
                // Call API with the active tab for media type and favourite flag
                const result = await fetchUserMediaList(activeTab, activeTab === 'FAVOURITES')

                if (result.success) {
                    // Sort the mediaList by 'name'
                    const sortedMediaList = result.mediaList.sort((a, b) => a.name.localeCompare(b.name))

                    setMediaData(sortedMediaList)
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
        },
        [activeTab]
    )

    useEffect(() => {
        if (['ANIME', 'MANGA', 'FAVOURITES'].includes(activeTab)) {
            fetchMediaData(true)
        }
    }, [activeTab, fetchMediaData])

    const refetchMedia = () => fetchMediaData()

    return (
        <AnimeHubContext.Provider value={{ mediaData, activeTab, setActiveTab, isLoading, refetchMedia, error }}>{children}</AnimeHubContext.Provider>
    )
}
