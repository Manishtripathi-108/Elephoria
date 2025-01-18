import { useCallback, useEffect, useRef, useState } from 'react'

import axios from 'axios'

/**
 * Custom React hook for making safe, flexible, and reusable API calls with retries, cancellation tokens,
 * and support for custom API clients.
 *
 * @param {object} config - Configuration options for the hook.
 * @param {object} [config.apiClient=axios] - Custom API client to use for the requests (defaults to Axios).
 * @param {number} [config.retryCount=0] - Number of retry attempts on failure (defaults to 0).
 * @returns {object} Hook API: { isLoading, error, data, makeApiCall, cancelRequest }.
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
     * Makes a safe API call with support for retries, callbacks, and cancellation tokens.
     *
     * @param {object} options - Options for the API call.
     * @param {string} options.url - API endpoint URL.
     * @param {string} options.method - HTTP method (e.g., 'GET', 'POST', 'PUT', etc.) (defaults to 'GET').
     * @param {object} [options.data] - Request body for POST/PUT requests.
     * @param {object} [options.params] - Query parameters for the request.
     * @param {object} [options.headers] - Additional request headers.
     * @param {string} [options.responseType='json'] - Expected response type (e.g., 'json', 'blob', etc.).
     * @param {function} [options.onUploadProgress] - Callback for upload progress events.
     * @param {function|Promise} [options.onStart] - Callback (sync/async) executed before making the API call.
     * @param {function} [options.onSuccess] - Callback executed on successful API response.
     * @param {function} [options.onError] - Callback executed on API error.
     * @param {function} [options.onEnd] - Callback executed after the API call completes.
     */
    const makeApiCall = useCallback(
        async ({
            url,
            method = 'GET',
            data = null,
            params = null,
            headers = {},
            responseType = 'json',
            onUploadProgress = null,
            onStart = null,
            onSuccess = null,
            onError = null,
            onEnd = null,
        }) => {
            setIsLoading(true)
            setError(null)
            let attempts = 0

            try {
                // Trigger async/sync onStart callback if provided
                if (onStart) {
                    console.log('[useSafeApiCall] Executing onStart callback:', onStart)

                    const startResult = await onStart()
                    if (startResult === false) {
                        setIsLoading(false)
                        return // Abort the call if onStart explicitly returns `false`
                    }

                    if (startResult && !data) {
                        console.log('[useSafeApiCall] Using onStart data:', startResult)
                        data = startResult
                    }
                }

                while (attempts <= retryCount) {
                    try {
                        // Set up a new AbortController for each attempt
                        abortControllerRef.current = new AbortController()

                        console.log('[useSafeApiCall] Making API call:', { url, method, data, params, headers, responseType })
                        const response = await apiClient({
                            url,
                            method,
                            data,
                            params,
                            headers,
                            responseType,
                            signal: abortControllerRef.current.signal,
                            onUploadProgress,
                        })

                        if (isMounted.current) {
                            // Handle unsuccessful responses flagged by the API
                            if (response.data && response.data.success === false) {
                                throw new Error(response.data.message || 'API responded with failure')
                            }

                            setData(response.data)

                            // Trigger success callback if provided
                            if (onSuccess) onSuccess(response.data)
                        }
                        return // Exit on successful request
                    } catch (err) {
                        attempts++
                        if (isMounted.current && err.name !== 'CanceledError' && (attempts > retryCount || retryCount === 0)) {
                            console.warn('[useSafeApiCall] Request failed:', err)
                            setError(err.response?.data?.message || err.message || 'An error occurred')

                            // Trigger error callback if provided
                            if (onError) onError(err)
                        }

                        if (err.name === 'CanceledError') {
                            console.warn('Request cancelled:', err.message)
                        }

                        if (!isMounted.current || attempts > retryCount) {
                            break
                        }
                    } finally {
                        abortControllerRef.current = null
                        setIsLoading(false)

                        // Trigger end callback, if provided
                        if (onEnd) {
                            onEnd()
                        }
                    }
                }
            } catch (startError) {
                console.error('[useSafeApiCall] Error in onStart callback:', startError)
                setError('An error occurred during initialization')
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
