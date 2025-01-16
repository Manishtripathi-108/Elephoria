import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import useAuthToken from '../context/AuthTokenContext'
import useFirstRender from '../hooks/useFirstRender'
import '../utils/auth.utils'
import { loginToAnilist, loginToSpotify } from '../utils/auth.utils'

const STATE = {
    SPOTIFY: sessionStorage.getItem('spotify_auth_state') || null,
    ANILIST: sessionStorage.getItem('anilist_auth_state') || null,
}
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const state = urlParams.get('state')

const PlatformRedirect = ({ platform, onRedirect }) => {
    const { setIsAuth } = useAuthToken()
    const navigate = useNavigate()
    const isFirst = useFirstRender()

    useEffect(() => {
        onRedirect(code, setIsAuth, navigate, isFirst, STATE[platform.toUpperCase()], state)
        return () => {
            sessionStorage.removeItem(`${platform.toLowerCase()}_auth_state`)
        }
    }, [])

    return (
        <div className="h-calc-full-height grid place-items-center p-2">
            <section className="shadow-neumorphic-lg w-full max-w-md rounded-2xl border p-2 text-center sm:p-6">
                <div className="rounded-xl border p-6">
                    <h1 className="text-primary mb-4 text-3xl font-bold">Logging in...</h1>
                </div>
            </section>
        </div>
    )
}

export const SpotifyRedirect = () => {
    return <PlatformRedirect platform="Spotify" onRedirect={loginToSpotify} />
}

export const AnilistRedirect = () => {
    return <PlatformRedirect platform="AniList" onRedirect={loginToAnilist} />
}

export default PlatformRedirect
