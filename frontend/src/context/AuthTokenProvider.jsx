import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import axios from 'axios'

import API_ROUTES, { API_TYPES } from '../constants/apiRoutes'
import useApiClient from '../hooks/useApiClient'

const AuthTokenContext = createContext()

export const useAuthToken = () => useContext(AuthTokenContext)

const AuthTokenProvider = ({ children }) => {
    const [tokens, setTokens] = useState({ app: null, anilist: null })
    const [isAuth, setIsAuth] = useState({ app: false, anilist: false })
    const [expirationTimers, setExpirationTimers] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState({ app: false, anilist: false })

    // Function to set a token with an expiration timer
    const setToken = useCallback(
        (type, token, expiresIn) => {
            console.log('Setting token:', { type, token, expiresIn })
            setTokens((prev) => ({ ...prev, [type]: token }))
            setIsAuth((prev) => ({ ...prev, [type]: true }))

            if (expirationTimers[type]) clearTimeout(expirationTimers[type])

            if (expiresIn > 0) {
                const timer = setTimeout(() => {
                    console.log(`Token expired for type: ${type}`)
                    setTokens((prev) => ({ ...prev, [type]: null }))
                    refreshTokens(type)
                }, expiresIn * 1000)

                setExpirationTimers((prev) => ({ ...prev, [type]: timer }))
            }
        },
        [expirationTimers]
    )

    // Function to refresh a token
    const refreshTokens = useCallback(
        async (type) => {
            if (refreshing[type]) {
                console.log(`Refresh already in progress for type: ${type}`)
                return false
            }

            console.log('Refreshing token for:', type)
            setRefreshing((prev) => ({ ...prev, [type]: true }))
            try {
                const refreshRoute = type === API_TYPES.APP ? API_ROUTES.APP.REFRESH_TOKEN : API_ROUTES.ANIME_HUB.REFRESH_TOKEN
                const { data } = await axios.post(refreshRoute, { withCredentials: true, timeout: 10000 })
                console.log('Refresh token response:', data)

                const newToken = type === API_TYPES.APP ? data.appAccessToken : data.anilistAccessToken
                const expiresIn = data.expiresIn

                if (newToken && expiresIn) {
                    setToken(type, newToken, expiresIn)
                } else {
                    setIsAuth((prev) => ({ ...prev, [type]: false }))
                }
            } catch (error) {
                setIsAuth((prev) => ({ ...prev, [type]: false }))
                console.error('Failed to refresh token:', error)
            } finally {
                setRefreshing((prev) => ({ ...prev, [type]: false }))
            }

            return true
        },
        [setToken, refreshing]
    )

    // Function to clear a specific token
    const clearToken = useCallback(
        (type) => {
            console.log('Clearing token for type:', type)

            setTokens((prev) => ({ ...prev, [type]: null }))
            setIsAuth((prev) => ({ ...prev, [type]: false }))

            if (expirationTimers[type]) {
                clearTimeout(expirationTimers[type])
                setExpirationTimers((prev) => ({ ...prev, [type]: null }))
            }
        },
        [expirationTimers]
    )

    // Clear all tokens
    const clearAllTokens = useCallback(() => {
        console.log('Clearing all tokens')

        setTokens({ app: null, anilist: null })
        setIsAuth({ app: false, anilist: false })
        Object.values(expirationTimers).forEach(clearTimeout)
        setExpirationTimers({})
    }, [expirationTimers])

    // Initialize tokens on app load
    const initializeTokens = useCallback(async () => {
        console.log('Initializing tokens')
        try {
            const { data } = await axios.post(API_ROUTES.TOKEN_FETCH, { withCredentials: true })

            if (data.appAccessToken) {
                setToken(API_TYPES.APP, data.appAccessToken, data.appAccessTokenExpiresIn)
            } else {
                setIsAuth((prev) => ({ ...prev, app: false }))
            }

            if (data.anilistAccessToken) {
                setToken(API_TYPES.ANILIST, data.anilistAccessToken, data.anilistAccessTokenExpiresIn)
            } else {
                setIsAuth((prev) => ({ ...prev, anilist: false }))
            }
        } catch (error) {
            console.error('Error initializing tokens:', error)
        } finally {
            setLoading(false)
        }
    }, [setToken])

    // Ensure `initializeTokens` runs only once
    useEffect(() => {
        console.log('AuthTokenProvider: useEffect -> initializeTokens')
        initializeTokens()

        return () => {
            console.log('Cleaning up')
            clearAllTokens()
        }
    }, [])

    // API Clients for app and AniList
    const appApiClient = useApiClient(API_TYPES.APP, { tokens, setToken, clearToken })
    const anilistApiClient = useApiClient(API_TYPES.ANILIST, { tokens, setToken, clearToken })

    return (
        <AuthTokenContext.Provider
            value={{
                tokens,
                setToken,
                clearToken,
                clearAllTokens,
                refreshTokens,
                isAuth,
                setIsAuth,
                loading,
                setLoading,
                appApiClient,
                anilistApiClient,
            }}>
            {children}
        </AuthTokenContext.Provider>
    )
}

export default AuthTokenProvider
