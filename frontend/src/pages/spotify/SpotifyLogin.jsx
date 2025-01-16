import React from 'react'

import { Icon } from '@iconify/react/dist/iconify.js'

import iconMap from '../../constants/iconMap'

const STATE = (Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18)).substring(0, 16)
sessionStorage.setItem('spotify_auth_state', STATE)
console.log('Spotify Auth State:', STATE)

const SpotifyLogin = () => {
    // Function to generate a random string
    const redirectToSpotifyLogin = () => {
        const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
            response_type: 'code',
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            state: STATE,
            scope: import.meta.env.VITE_SPOTIFY_SCOPES,
            redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        }).toString()}`

        window.location.href = authUrl
    }

    return (
        <div className="h-calc-full-height grid place-items-center p-2">
            <div className="shadow-neumorphic-lg w-full max-w-md rounded-2xl border bg-gray-800 p-2 text-center sm:p-6">
                <div className="rounded-xl border p-6">
                    <Icon icon={iconMap.spotify} className="mb-6 inline-block size-20 shrink-0 text-green-500" />

                    <h1 className="text-primary mb-4 text-3xl font-bold">Login with Spotify</h1>
                    <p className="text-secondary mb-6">
                        Connect your Spotify account to continue. We need authorization to access your playlists and manage your music data.
                    </p>

                    <button
                        title="Authorize with Spotify"
                        type="button"
                        onClick={redirectToSpotifyLogin}
                        className="text-primary button inline-block rounded-lg bg-green-500 px-6 py-2 font-semibold">
                        Authorize with Spotify
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SpotifyLogin
