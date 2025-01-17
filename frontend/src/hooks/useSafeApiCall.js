import { useCallback, useEffect, useRef, useState } from 'react'

import axios from 'axios'

/**
 * Custom React hook for making safe, flexible, and reusable API calls with retries, cancellation tokens,
 * and support for a custom API client (defaults to Axios).
 *
 * @param {object} config - Configuration options for the hook.
 * @param {object} [config.apiClient=axios] - Custom API client to use for the requests. Defaults to Axios.
 * @param {number} [config.retryCount=0] - Number of retry attempts on failure. Defaults to 0.
 * @returns {object} - Hook API: { isLoading, error, data, makeApiCall, cancelRequest }.
 */
function useSafeApiCall({ apiClient = axios, retryCount = 0 } = {}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    const isMounted = useRef(true)
    const abortControllerRef = useRef(null)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
            cancelRequest('Component unmounted')
        }
    }, [])

    /**
     * Makes a safe API call with retry logic and cancellation support.
     *
     * @param {object} options - Options for the API call.
     * @param {string} options.url - API endpoint URL.
     * @param {string} options.method - HTTP method (e.g., 'GET', 'POST', 'PUT', etc.).
     * @param {object} [options.data] - Request body for POST/PUT requests.
     * @param {object} [options.params] - Query parameters for the request.
     * @param {object} [options.headers] - Additional request headers.
     * @param {string} [options.responseType='json'] - Expected response type (e.g., 'json', 'blob', etc.).
     * @param {function} [options.onSuccess] - Callback executed on successful API response.
     * @param {function} [options.onError] - Callback executed on API error.
     */
    const makeApiCall = useCallback(
        async ({ url, method = 'GET', data = null, params = null, headers = {}, responseType = 'json', onSuccess = null, onError = null }) => {
            console.log('Making API call:', { url, method, data, params, headers, responseType })

            setIsLoading(true)
            setError(null)
            let attempts = 0

            while (attempts <= retryCount) {
                try {
                    // Set up a new AbortController for each attempt
                    abortControllerRef.current = new AbortController()

                    const response = await apiClient({
                        url,
                        method,
                        data,
                        params,
                        headers,
                        responseType,
                        signal: abortControllerRef.current.signal,
                    })

                    if (isMounted.current) {
                        // If the API response indicates a failure, throw an error
                        if (response.data && response.data.success === false) {
                            throw new Error(response.data.message || 'API response indicates failure')
                        }

                        setData(response.data)

                        // Trigger success callback, if provided
                        if (onSuccess) {
                            onSuccess(response.data)
                        }
                    }
                    return // Exit on success
                } catch (err) {
                    attempts++
                    if (isMounted.current && err.name !== 'CanceledError' && attempts > retryCount) {
                        console.error('API request failed:', err)
                        setError(err.message || err.response?.data?.message || 'An error occurred')

                        // Trigger error callback, if provided
                        if (onError) {
                            onError(err)
                        }
                    }

                    if (err.name === 'CanceledError') {
                        console.warn('Request cancelled:', err.message)
                    }

                    // Stop retrying if the component is unmounted or retries are exhausted
                    if (!isMounted.current || attempts > retryCount) {
                        break
                    }
                } finally {
                    abortControllerRef.current = null
                    setIsLoading(false)
                }
            }
        },
        [apiClient, retryCount]
    )

    /**
     * Cancels the ongoing API request (if any) using the stored AbortController.
     *
     * @param {string} [reason="Request cancelled"] - Reason for cancelling the request.
     */
    const cancelRequest = useCallback((reason = 'Request cancelled') => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort(reason)
        }
    }, [])

    return { isLoading, error, data, makeApiCall, cancelRequest }
}

export default useSafeApiCall
