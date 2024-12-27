import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { fetchUserMediaList, isAuthenticated } from '../api/animeHubApi'

const AnimeHubContext = createContext()

export const useAnimeHubContext = () => useContext(AnimeHubContext)

export const AnimeHubProvider = ({ children }) => {
    const abortControllerRef = useRef(null)
    const [mediaContent, setMediaContent] = useState([])
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

    const navigate = useNavigate()

    const fetchMediaContent = useCallback(
        async (reload = false) => {
            if (!isUserAuthenticated) {
                console.warn('User is not authenticated. Skipping media fetch.')
                return
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            abortControllerRef.current = new AbortController()

            setIsLoading(reload)
            setError(null)

            try {
                // Fetch media content for the active tab
                const result = await fetchUserMediaList(activeTab, activeTab === 'FAVOURITES', abortControllerRef.current.signal)

                if (result.success) {
                    // Sort mediaList alphabetically by 'name', except for FAVOURITES
                    const sortedMediaList =
                        activeTab !== 'FAVOURITES' ? result.mediaList.sort((a, b) => a.name.localeCompare(b.name)) : result.mediaList

                    setMediaContent(sortedMediaList)
                } else if (result.retryAfterSeconds > 0) {
                    window.addToast(`Rate limit exceeded. Try again after ${result.retryAfterSeconds} seconds.`, 'error')
                } else {
                    window.addToast(result.message, 'error')
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted')
                } else {
                    setError(error)
                    window.addToast(`Error fetching ${activeTab.toLowerCase()} data.`, 'error', 10000)
                    console.error(`Error fetching ${activeTab.toLowerCase()} data:`, error)
                }
            } finally {
                setIsLoading(false)
            }
        },
        [activeTab, isUserAuthenticated]
    )

    // Check user authentication on load
    useEffect(() => {
        const checkAuthentication = async () => {
            window.addToast('Checking authentication status...', 'info')
            if (location.pathname === '/anime-hub' || location.pathname === '/anime-hub/auth') {
                setIsLoading(true)
                const isAuth = await isAuthenticated(abortControllerRef.current?.signal)
                setIsUserAuthenticated(isAuth)

                if (isAuth) {
                    console.log('User is authenticated')
                    navigate('/anime-hub')
                } else {
                    console.log('User is not authenticated')
                    navigate('/anime-hub/auth')
                }

                setIsLoading(false)
            }
        }

        checkAuthentication()
    }, [location, navigate])

    // Fetch media content when the active tab changes and the user is authenticated
    useEffect(() => {
        if (isUserAuthenticated && ['ANIME', 'MANGA', 'FAVOURITES'].includes(activeTab)) {
            fetchMediaContent(true)
        }
    }, [activeTab, fetchMediaContent, isUserAuthenticated])

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    const refetchMedia = () => fetchMediaContent()

    return (
        <AnimeHubContext.Provider
            value={{
                mediaContent,
                activeTab,
                setActiveTab,
                isLoading,
                refetchMedia,
                error,
            }}>
            {children}
        </AnimeHubContext.Provider>
    )
}
