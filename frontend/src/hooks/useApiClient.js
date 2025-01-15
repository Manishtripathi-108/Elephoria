import axios from 'axios'

import API_ROUTES, { API_TYPES } from '../constants/api.constants'

const useApiClient = (apiType, { setAuth, setLoading }) => {
    const client = axios.create({ withCredentials: true })
    const refreshClient = axios.create({ withCredentials: true })

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            if (error.response?.status === 401 && !originalRequest._retry) {
                setLoading(true)
                originalRequest._retry = true

                try {
                    console.log('Refreshing token:-> in client', originalRequest)

                    const refreshRoute = apiType === API_TYPES.APP ? API_ROUTES.APP.REFRESH_TOKEN : API_ROUTES.ANIME_HUB.REFRESH_TOKEN
                    const { data } = await refreshClient.post(refreshRoute)

                    if (data.success) {
                        console.log('Token refreshed:', data)
                        setAuth(true)
                        return client(originalRequest)
                    } else {
                        setAuth(false)
                    }
                } catch (err) {
                    setAuth(false)
                    console.error('Error during token refresh:', err)
                    throw err
                } finally {
                    setLoading(false)
                }
            }

            throw error
        }
    )

    return client
}

export default useApiClient
