import axios from 'axios'

import API_ROUTES from '../constants/api.constants'
import APP_ROUTES from '../constants/app.constants'

export const redirectToSpotifyLogin = () => {
    const STATE = (Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18)).substring(0, 16)
    sessionStorage.setItem('spotify_auth_state', STATE)
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        scope: import.meta.env.VITE_SPOTIFY_SCOPES,
        state: STATE,
        response_type: 'code',
    }).toString()}`

    window.location.href = authUrl
}

export const redirectToAnilistLogin = () => {
    sessionStorage.setItem('anilist_auth_state', true)
    const authUrl = `https://anilist.co/api/v2/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_ANILIST_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_ANILIST_REDIRECT_URI,
        response_type: 'code',
    }).toString()}`

    window.location.href = authUrl
}

/**
 * Logs the user into Spotify and saves the access token in session storage
 * @param {string} code Authorization code returned by Spotify
 * @param {function} setIsAuth Function to set the auth state in the AuthTokenContext
 * @param {useNavigate} navigate Function to navigate to a different page
 * @param {boolean} isFirst A boolean indicating if this is the first render of the page
 * @param {string} localState The state value stored in the session storage
 * @param {string} state The state value returned by Spotify
 */
export const loginToSpotify = async (code, setIsAuth, navigate, isFirst, localState, state) => {
    try {
        console.log('Logging in to Spotify')
        if (state !== localState || !code) {
            console.error('Invalid Spotify Auth State!')
            throw new Error()
        }

        if (!isFirst || !sessionStorage.getItem('spotify_auth_state')) {
            console.log('Not first render')
            return
        }

        const { data } = await axios.post(API_ROUTES.SPOTIFY.LOGIN, { code })

        if (data.success) {
            console.log('Successfully Authenticated')
            window.addToast('Successfully Authenticated', 'success')
            setIsAuth((prev) => ({ ...prev, spotify: true }))
            navigate(APP_ROUTES.SPOTIFY.INDEX, { replace: true })
        }

        throw new Error()
    } catch (error) {
        console.error('Error during login:', error)
        window.addToast('Spotify login failed. Please try again!', 'error', 10000)
        navigate(APP_ROUTES.SPOTIFY.LOGIN, { replace: true })
    }
}

/**
 * Logs the user into AniList and saves the access token in session storage
 * @param {string} code The authorization code received from AniList
 * @param {function} setIsAuth A function to set the authentication state
 * @param {function} navigate A function to navigate to a different route
 * @param {boolean} isFirst Whether this is the first render
 * @param {string} localState The state parameter from the AniList redirect URL
 * @returns {Promise<void>}
 */
export const loginToAnilist = async (code, setIsAuth, navigate, isFirst, localState) => {
    try {
        console.log('Logging in to AniList')
        if (!localState || !code) {
            console.error('Invalid AniList Auth State!')
            throw new Error()
        }

        if (!isFirst || !sessionStorage.getItem('anilist_auth_state')) {
            console.log('Not first render')
            return
        }

        const { data } = await axios.post(API_ROUTES.ANILIST.LOGIN, { code })
        if (data.success) {
            console.log('Successfully Authenticated')
            window.addToast('Successfully Authenticated!', 'success')
            setIsAuth((prev) => ({ ...prev, anilist: true }))
            navigate(APP_ROUTES.ANILIST.INDEX, { replace: true })
            return
        }

        throw new Error(data?.message)
    } catch (error) {
        console.error('Error during login:', error)

        window.addToast('AniList login failed. Please try again!', 'error')
        navigate(APP_ROUTES.ANILIST.LOGIN, { replace: true })
    }
}
