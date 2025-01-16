import React, { memo, useEffect, useState } from 'react'

import { fetchUserData } from '../../../api/anilistApi'

const AnilistHeader = () => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getUserData = async () => {
            const response = await fetchUserData()

            if (response.success) {
                setUserData(response)
            } else {
                window.addToast(response.message, 'error')
                setError(response.message)
            }

            setLoading(false)
        }

        getUserData()
    }, [])

    const bannerStyle = {
        backgroundImage: `url(${userData?.bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    if (loading || error) {
        return (
            <header className="shadow-neumorphic-inset-lg w-full animate-pulse border-b bg-inherit">
                <div className="flex h-full w-full items-end justify-center">
                    <div className="bg-secondary h-36 w-28 rounded-t-lg md:h-48 md:w-36"></div>
                    <div className="bg-secondary ml-3 h-8 w-36 rounded-lg"></div>
                </div>
            </header>
        )
    }

    return (
        <header className="shadow-neumorphic-inset-lg flex w-full items-end justify-center border-b bg-white/20 dark:bg-black/30" style={bannerStyle}>
            <div className="mt-10 flex w-5/6 max-w-(--breakpoint-md) items-end justify-start gap-5 opacity-100 md:mt-20">
                <img src={userData?.avatar?.large} alt={`${userData?.name}'s avatar`} className="w-28 rounded-t-lg align-text-top md:w-36" />
                <h1 className="text-primary font-aladin mb-5 w-full truncate text-3xl font-bold tracking-widest">{userData?.name}</h1>
            </div>
        </header>
    )
}

export default memo(AnilistHeader)
