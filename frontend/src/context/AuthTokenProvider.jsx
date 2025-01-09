import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import API_ROUTES, { API_TYPES } from '../constants/apiRoutes'
import useApiClient from '../hooks/useApiClient'

const AuthTokenContext = createContext()

export const useAuthToken = () => useContext(AuthTokenContext)

const AuthTokenProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState({ app: false, anilist: false })
    const [loading, setLoading] = useState(true)
    const abortControllerRef = useRef(null)

    // API Clients for app and AniList
    const appApiClient = useApiClient(API_TYPES.APP, {
        setAuth: (isAuthenticated) => setIsAuth((prev) => ({ ...prev, app: isAuthenticated })),
        setLoading,
    })
    const anilistApiClient = useApiClient(API_TYPES.ANILIST, {
        setAuth: (isAuthenticated) => setIsAuth((prev) => ({ ...prev, anilist: isAuthenticated })),
        setLoading,
    })

    /**
     * Checks authentication for a specific API type.
     * @param {string} apiType - The API type to check ('app' or 'anilist').
     */
    const checkAuth = useCallback(
        async (apiType) => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            abortControllerRef.current = new AbortController()
            setLoading(true)
            try {
                if (apiType === API_TYPES.APP) {
                    // Example: Uncomment this line when the API is ready
                    // const { data } = await appApiClient.post(API_ROUTES.APP.CHECK_AUTH);
                    // setIsAuth((prev) => ({ ...prev, app: data.success }));
                    console.log('Checked App authentication.')
                } else if (apiType === API_TYPES.ANILIST) {
                    const { data } = await anilistApiClient.post(API_ROUTES.ANIME_HUB.CHECK_AUTH, { signal: abortControllerRef.current.signal })
                    setIsAuth((prev) => ({ ...prev, anilist: data.success }))
                    console.log('Checked AniList authentication.')
                }
            } catch (error) {
                console.error(`Error checking authentication for ${apiType}:`, error)
            } finally {
                abortControllerRef.current = null
                setLoading(false)
            }
        },
        [appApiClient, anilistApiClient]
    )

    useEffect(() => {
        ;(async () => {
            console.log('AuthTokenProvider: Initializing authentication checks.')
            // await checkAuth(API_TYPES.APP)
            await checkAuth(API_TYPES.ANILIST)
        })()
    }, [])

    return (
        <AuthTokenContext.Provider
            value={{
                isAuth,
                setIsAuth,
                loading,
                setLoading,
                checkAuth,
                appApiClient,
                anilistApiClient,
            }}>
            {children}
        </AuthTokenContext.Provider>
    )
}

export default AuthTokenProvider
