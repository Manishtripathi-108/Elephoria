import React, { memo, useEffect, useRef, useState } from 'react'

import { fetchUserData } from '../../../api/animeHubApi'
import { useAnimeHubContext } from '../../../context/AnimeHubContext'

const Header = () => {
    // const { loading } = useAnimeHubContext()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const retryTimeoutRef = useRef(null)

    useEffect(() => {
        const getUserData = async () => {
            const response = await fetchUserData()

            if (response.success) {
                setUserData(response)
                setLoading(false)
            } else if (response.retryAfterSeconds > 0) {
                retryTimeoutRef.current = setTimeout(getUserData, response.retryAfterSeconds * 1000)
            } else {
                window.addToast(response.message || 'Oops! Something went wrong. Please try refreshing the page or come back later.', 'error')
                setError('Oops! Something went wrong. Please try refreshing the page or come back later.')
                setLoading(false)
            }
        }

        getUserData()

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    }, [])

    const bannerStyle = {
        backgroundImage: `url(${userData?.bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    if (loading || error) {
        return (
            <header className="shadow-neumorphic-inset-lg">
                <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                    <div className="max-w-(--breakpoint-md) flex w-5/6 items-end justify-start gap-5 pt-4 opacity-100 md:pt-20">
                        {/* Skeleton for avatar */}

                        {error ? (
                            <div className="h-36 w-full p-2 text-center text-red-500">{error}</div>
                        ) : (
                            <>
                                <div className="bg-secondary h-36 w-full max-w-28 animate-pulse rounded-t-lg md:h-48 md:max-w-36"></div>
                                <div className="bg-secondary mb-5 h-8 w-1/2 animate-pulse rounded-sm"></div>
                            </>
                        )}
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="h-[45dvh] shadow-neumorphic-inset-lg" style={bannerStyle}>
            <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                <div className="max-w-(--breakpoint-md) flex w-5/6 flex-wrap items-end justify-start gap-5 opacity-100 md:pt-20">
                    <img
                        src={userData?.avatar?.large}
                        alt={`${userData?.name}'s avatar`}
                        className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36"
                    />
                    <h1 className="text-primary mb-5 font-aladin text-3xl font-bold tracking-widest">{userData?.name}</h1>
                </div>
            </div>
        </header>
    )
}

export default memo(Header)
