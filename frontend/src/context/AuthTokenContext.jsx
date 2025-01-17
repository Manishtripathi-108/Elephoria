import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import axios from 'axios'

import API_ROUTES, { API_TYPE } from '../constants/api.constants'
import useApiClient from '../hooks/useApiClient'

const AuthTokenContext = createContext()

/**
 * Custom hook to access the authentication token context.
 *
 * @returns {Object} The context value containing authentication state and functions.
 * @property {Object} isAuth - The authentication state for the app and AniList.
 * @property {Function} setIsAuth - Function to update the authentication state.
 * @property {boolean} loading - The loading state indicating if authentication check is in progress.
 * @property {Function} setLoading - Function to update the loading state.
 * @property {Function} checkAuth - Function to check the authentication status for all APIs.
 * @property {Object} appApiClient - API client for the app.
 * @property {Object} anilistApiClient - API client for AniList.
 * @property {Object} spotifyApiClient - API client for Spotify.
 */
const useAuthToken = () => useContext(AuthTokenContext)

export const AuthTokenProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState({ app: false, anilist: false, spotify: false })
    const [loading, setLoading] = useState(true)
    const abortControllerRef = useRef(null)

    /* ------------------------------- API Clients ------------------------------ */
    const appApiClient = useApiClient(API_TYPE.APP, (isAuthenticated) => setIsAuth((prev) => ({ ...prev, app: isAuthenticated })))
    const anilistApiClient = useApiClient(API_TYPE.ANILIST, (isAuthenticated) => setIsAuth((prev) => ({ ...prev, anilist: isAuthenticated })))
    const spotifyApiClient = useApiClient(API_TYPE.SPOTIFY, (isAuthenticated) => setIsAuth((prev) => ({ ...prev, spotify: isAuthenticated })))

    const refreshTokens = async (data) => {
        const refreshToken = async (route, key) => {
            try {
                const response = await axios.post(route)
                setIsAuth((prev) => ({ ...prev, [key]: response?.data?.success }))
            } catch (error) {
                console.error(`Error refreshing ${key} token:`, error)
            }
        }

        if (!data.app) await refreshToken(API_ROUTES.APP.REFRESH_TOKEN, 'app')
        if (!data.anilist) await refreshToken(API_ROUTES.ANILIST.REFRESH_TOKEN, 'anilist')
        if (!data.spotify) await refreshToken(API_ROUTES.SPOTIFY.REFRESH_TOKEN, 'spotify')
    }

    /* ------------- Checks the authentication status for all APIs. ------------- */
    const checkAuth = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()
        setLoading(true)
        let currentAuth = isAuth
        try {
            const response = await axios.post(API_ROUTES.CHECK_ALL_AUTH, { signal: abortControllerRef.current.signal, withCredentials: true })

            if (response?.data?.success) {
                console.log('Authentication status:', response.data)

                const { anilist, spotify } = response.data

                currentAuth = { ...currentAuth, anilist, spotify }
                setIsAuth((prev) => ({ ...prev, anilist, spotify }))
            } else {
                throw new Error('Failed to check authentication status.')
            }
        } catch (error) {
            console.error('Error checking authentication status:', error)
        } finally {
            abortControllerRef.current = null
            await refreshTokens(currentAuth)
            setLoading(false)
        }
    }, [setIsAuth, setLoading])

    useEffect(() => {
        checkAuth()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [checkAuth])

    const contextValue = useMemo(
        () => ({
            isAuth,
            setIsAuth,
            loading,
            setLoading,
            checkAuth,
            appApiClient,
            anilistApiClient,
            spotifyApiClient,
        }),
        [isAuth, loading, checkAuth, appApiClient, anilistApiClient, spotifyApiClient]
    )

    return <AuthTokenContext.Provider value={contextValue}>{children}</AuthTokenContext.Provider>
}

export default useAuthToken
