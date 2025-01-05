import axios from 'axios'

import API_ROUTES, { API_TYPES } from '../constants/apiRoutes'


/**
 * Creates an axios client instance with auth token handling for the specified API type.
 * It will add the auth token to the headers of each request if it exists.
 * If a request returns a 401 status code, it will attempt to refresh the access token
 * and retry the request. If the refresh fails, it will clear the token and throw the error.
 * @param {string} apiType - Type of API to use.
 * @param {object} options - Options for the client.
 * @param {object} options.tokens - Object containing the auth tokens.
 * @param {function(string, string, number)} options.setToken - Function to set a new auth token.
 * @param {function(string)} options.clearToken - Function to clear the auth token.
 * @returns {object} - Axios client instance.
 */
const useApiClient = (apiType, { tokens, setToken, clearToken }) => {
    const client = axios.create()
    const refreshClient = axios.create({ withCredentials: true })

    client.interceptors.request.use((config) => {
        const token = tokens[apiType]
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    })

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const refreshRoute = apiType === API_TYPES.APP ? API_ROUTES.APP.REFRESH_TOKEN : API_ROUTES.ANIME_HUB.REFRESH_TOKEN
                    const { data } = await refreshClient.post(refreshRoute)

                    const newToken = apiType === API_TYPES.APP ? data.appAccessToken : data.anilistAccessToken
                    const expiresIn = data.expires_in

                    if (newToken && expiresIn) {
                        setToken(apiType, newToken, expiresIn)
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        return client(originalRequest)
                    }
                } catch (err) {
                    console.error('Error during token refresh:', err)
                    clearToken(apiType)
                    throw err
                }
            }

            throw error
        }
    )

    return client
}

export default useApiClient
