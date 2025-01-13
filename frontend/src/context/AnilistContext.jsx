import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { use } from 'react'

import { useParams } from 'react-router-dom'

import { fetchUserMediaList } from '../api/animeHubApi'
import NotFound from '../pages/404-page'

const AnilistContext = createContext()

export const AnilistProvider = ({ children }) => {
    const [watchList, setWatchList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editEntry, setEditEntry] = useState(null)
    const abortControllerRef = useRef(null)
    const params = useParams()
    const mediaType = params?.type || 'anime'
    console.log(mediaType)

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

            const { success, mediaList, message } = await fetchUserMediaList(mediaType, abortControllerRef.current.signal)

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
    }, [mediaType])

    useEffect(() => {
        if (['anime', 'manga', 'favourites'].includes(mediaType)) {
            fetchWatchList()
        }
    }, [fetchWatchList])

    useEffect(() => {
        const editModal = document.getElementById('modal-anilist-edit-media')
        if (editModal) {
            editEntry?.id ? editModal.showModal() : editModal.close()
        }
    }, [editEntry])

    return (
        <AnilistContext.Provider value={{ mediaType, watchList, loading, error, editEntry, setEditEntry, fetchWatchList }}>
            {['anime', 'manga', 'favourites'].includes(mediaType) ? children : <NotFound />}
        </AnilistContext.Provider>
    )
}

export const useAnilist = () => useContext(AnilistContext)
