import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../constants/iconMap'
import { redirectToAnilistLogin, redirectToSpotifyLogin } from '../utils/auth.utils'

const PlatformLogin = ({ platform, icon, iconClassName, description, onAuthorize }) => {
    return (
        <div className="h-calc-full-height grid place-items-center p-2">
            <section className="shadow-neumorphic-lg w-full max-w-md rounded-2xl border p-2 text-center sm:p-6">
                <div className="rounded-xl border p-6">
                    {icon && <Icon icon={iconMap[icon]} className={`mb-6 inline-block size-20 shrink-0 ${iconClassName}`} />}

                    <h1 className="text-text-primary mb-4 text-3xl font-bold">Login with {platform}</h1>
                    <p className="text-text-secondary mb-6">{description}</p>

                    <button title={`Authorize with ${platform}`} type="button" onClick={onAuthorize} className="button inline-block font-semibold">
                        Authorize with {platform}
                    </button>
                </div>
            </section>
        </div>
    )
}

export const SpotifyLogin = () => {
    return (
        <PlatformLogin
            platform="Spotify"
            icon="spotify"
            iconClassName="text-green-500"
            description="Connect your Spotify account to continue. We need authorization to access your playlists and manage your music data."
            onAuthorize={redirectToSpotifyLogin}
        />
    )
}

export const AnilistLogin = () => {
    return (
        <PlatformLogin
            platform="AniList"
            icon="anilist"
            iconClassName="text-blue-500"
            description="Connect your AniList account to continue. We need authorization to access your AniList data."
            onAuthorize={redirectToAnilistLogin}
        />
    )
}

export default PlatformLogin
