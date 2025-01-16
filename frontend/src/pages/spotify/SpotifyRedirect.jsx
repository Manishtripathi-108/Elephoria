import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import APP_ROUTES from '../../constants/app.constants'
import useAuthToken from '../../context/AuthTokenContext'
import useFirstRender from '../../hooks/useFirstRender'

const STATE = sessionStorage.getItem('spotify_auth_state')
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const state = urlParams.get('state')

const SpotifyRedirect = () => {
    const { isAuth, setIsAuth } = useAuthToken()
    const navigate = useNavigate()
    const isFirst = useFirstRender()

    const loginToSpotify = async (code) => {
        try {
            console.log('Logging in to Spotify')

            if (!isFirst || !sessionStorage.getItem('spotify_auth_state')) {
                return
            }

            const { success } = await axios.post('/api/spotify/login', { code })

            if (!success) {
                throw new Error('Failed to authenticate')
            }

            window.addToast('Successfully Authenticated', 'success')
            navigate(APP_ROUTES.SPOTIFY.LOGIN, { replace: true })
        } catch (error) {
            console.error('Error during login:', error)
            window.addToast('Failed to authenticate', 'error', 10000)
            navigate(APP_ROUTES.SPOTIFY.LOGIN, { replace: true })
        }
    }

    useEffect(() => {
        if (state !== STATE || !code) {
            console.error('Invalid Spotify Auth State!')
            window.addToast('Failed to authenticate', 'error', 10000)
            navigate(APP_ROUTES.SPOTIFY.LOGIN, { replace: true })
            return
        } else {
            loginToSpotify(code)
        }
        return () => {
            sessionStorage.removeItem('spotify_auth_state')
        }
    }, [])

    return <div>Logging in...</div>
}

export default SpotifyRedirect
