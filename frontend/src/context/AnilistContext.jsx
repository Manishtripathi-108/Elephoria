import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Outlet, useLocation } from 'react-router-dom'

import { fetchUserMediaList } from '../api/animeHubApi'

const AnilistContext = createContext()

export const AnilistProvider = () => {
    const [watchList, setWatchList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modalId, setModalId] = useState(null)
    const abortControllerRef = useRef(null)
    const location = useLocation()

    const activeURL = decodeURIComponent(location.pathname.split('/').pop().toLowerCase())
    console.log(activeURL)

    const abortPreviousRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
        abortControllerRef.current = new AbortController()
    }

    const fetchWatchList = useCallback(async () => {
        try {
            console.log('Fetching media content...')

            abortPreviousRequest()
            setLoading(true)
            setError(null)

            const { success, mediaList, message } = await fetchUserMediaList(activeURL, abortControllerRef.current.signal)

            if (success) {
                console.log('Media content fetched successfully.', mediaList)
                setWatchList(mediaList)
            } else {
                setError(message)
                console.warn(message)
            }
        } catch (error) {
            setError('Failed to fetch media content.')
            console.error('Error fetching media content:', error)
        } finally {
            setLoading(false)
        }
    }, [activeURL])

    useEffect(() => {
        if (['anime', 'manga', 'favourites'].includes(activeURL)) {
            fetchWatchList()
        }
    }, [fetchWatchList])

    return (
        <AnilistContext.Provider value={{ watchList, loading, error, modalId, setModalId, fetchWatchList }}>
            <Outlet />
        </AnilistContext.Provider>
    )
}

export const useAnilist = () => useContext(AnilistContext)
