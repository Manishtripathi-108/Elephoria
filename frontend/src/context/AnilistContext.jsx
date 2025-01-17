import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { use } from 'react'

import { useParams } from 'react-router-dom'

import { fetchUserMediaList } from '../api/anilistApi'
import API_ROUTES from '../constants/api.constants'
import useSafeApiCall from '../hooks/useSafeApiCall'
import Page404 from '../pages/Page404'
import useAuthToken from './AuthTokenContext'

const AnilistContext = createContext()

export const AnilistProvider = ({ children }) => {
    const [watchList, setWatchList] = useState([])
    const [editEntry, setEditEntry] = useState(null)
    const params = useParams()
    const mediaType = params?.type || 'anime'
    const { anilistApiClient } = useAuthToken()
    const { isLoading, error, makeApiCall, cancelRequest } = useSafeApiCall({ apiClient: anilistApiClient })
    console.log(mediaType)

    useEffect(() => {
        if (['anime', 'manga', 'favourites'].includes(mediaType)) {
            cancelRequest('Media type changed')
            makeApiCall({
                url: mediaType === 'favourites' ? API_ROUTES.ANILIST.FAVOURITE : API_ROUTES.ANILIST.USER_MEDIA,
                method: 'POST',
                data: { mediaType },
                onSuccess: (data) => {
                    console.log('Media content fetched successfully.', data)
                    setWatchList(data.mediaList)
                },
            })
        }
    }, [mediaType])

    useEffect(() => {
        const editModal = document.getElementById('modal-anilist-edit-media')
        if (editModal) {
            editEntry?.id ? editModal.showModal() : editModal.close()
        }
    }, [editEntry])

    return (
        <AnilistContext.Provider value={{ mediaType, watchList, isLoading, error, editEntry, setEditEntry }}>
            {['anime', 'manga', 'favourites'].includes(mediaType) ? children : <Page404 />}
        </AnilistContext.Provider>
    )
}

export const useAnilist = () => useContext(AnilistContext)
