import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { fetchUserMediaList, isAuthenticated } from '../api/animeHubApi'
import APP_ROUTES from '../constants/appRoutes'

const AnimeHubContext = createContext()

export const useAnimeHubContext = () => useContext(AnimeHubContext)

export const AnimeHubProvider = ({ children }) => {
    const abortControllerRef = useRef(null)
    const navigate = useNavigate()

    const [mediaContent, setMediaContent] = useState([])
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false)
    const [error, setError] = useState(null)

    const abortPreviousRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
    }

    const checkAuthentication = useCallback(async () => {
        try {
            abortPreviousRequest()
            setIsLoading(true)

            const isAuth = await isAuthenticated(abortControllerRef.current.signal)
            setIsAuthenticatedUser(isAuth)
            console.log(isAuth)

            // if (isAuth) {
            //     navigate(APP_ROUTES.ANIME_HUB.ROOT)
            // } else {
            //     navigate(APP_ROUTES.ANIME_HUB.LOGIN)
            // }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error checking authentication:', error)
            }
        } finally {
            setIsLoading(false)
        }
    }, [navigate])

    const fetchMediaContent = useCallback(async () => {
        if (!isAuthenticatedUser) return

        try {
            abortPreviousRequest()
            setIsLoading(true)
            setError(null)

            const result = await fetchUserMediaList(activeTab, activeTab === 'FAVOURITES', abortControllerRef.current.signal)

            if (result.success) {
                const sortedMedia = activeTab !== 'FAVOURITES' ? result.mediaList.sort((a, b) => a.name.localeCompare(b.name)) : result.mediaList

                setMediaContent(sortedMedia)
            } else {
                setError(result.message)
                console.warn(result.message)
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError('Failed to fetch media content.')
                console.error('Error fetching media content:', error)
            }
        } finally {
            setIsLoading(false)
        }
    }, [activeTab, isAuthenticatedUser])

    useEffect(() => {
        checkAuthentication()
    }, [checkAuthentication])

    useEffect(() => {
        if (isAuthenticatedUser && ['ANIME', 'MANGA', 'FAVOURITES'].includes(activeTab)) {
            fetchMediaContent()
        }
    }, [activeTab, isAuthenticatedUser, fetchMediaContent])

    useEffect(() => {
        return () => abortPreviousRequest()
    }, [])

    return (
        <AnimeHubContext.Provider
            value={{
                mediaContent,
                activeTab,
                setActiveTab,
                isLoading,
                error,
                refetchMedia: fetchMediaContent,
            }}>
            {children}
        </AnimeHubContext.Provider>
    )
}
