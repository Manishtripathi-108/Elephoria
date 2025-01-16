import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

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
 * @property {Function} checkAuth - Function to check authentication status for a given API type.
 * @property {Object} appApiClient - API client for the app.
 * @property {Object} anilistApiClient - API client for AniList.
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

    const checkAuth = useCallback(
        async (apiType) => {
            apiType = apiType.toLowerCase()
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            abortControllerRef.current = new AbortController()
            setLoading(true)
            try {
                if (apiType === API_TYPE.APP) {
                    // Example: Uncomment this line when the API is ready
                    // const { data } = await appApiClient.post(API_ROUTES.APP.CHECK_AUTH);
                    // setIsAuth((prev) => ({ ...prev, app: data.success }));
                    // console.log('Checked App authentication.')
                } else if (apiType === API_TYPE.ANILIST) {
                    const { data } = await anilistApiClient.post(API_ROUTES.ANILIST.CHECK_AUTH, { signal: abortControllerRef.current.signal })
                    setIsAuth((prev) => ({ ...prev, anilist: data.success }))
                    // console.log('Checked AniList authentication.')
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
            // console.log('AuthTokenProvider: Initializing authentication checks.')
            // await checkAuth(API_TYPE.APP)
            await checkAuth(API_TYPE.ANILIST)
            // await checkAuth(API_TYPE.SPOTIFY)
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
                spotifyApiClient,
            }}>
            {children}
        </AuthTokenContext.Provider>
    )
}

export default useAuthToken
