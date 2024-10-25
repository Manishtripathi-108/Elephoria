import React, { useEffect, useState } from 'react'

import axios from 'axios'

function AnimeHeader() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            setError('No access token found')
            setLoading(false)
            return
        }

        const getUserData = async () => {
            try {
                const response = await axios.post('/api/anime-hub/user-data', { accessToken })
                setUserData(response.data)
            } catch (err) {
                setError('Error fetching user data')
            } finally {
                setLoading(false)
            }
        }

        getUserData()
    }, [])

    const bannerStyle = {
        backgroundImage: `url(${userData?.bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    if (loading) {
        return (
            <header className="shadow-neu-inset-light-lg dark:shadow-neu-inset-dark-lg">
                <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                    <div className="flex w-5/6 max-w-screen-md items-end justify-start gap-5 pt-4 opacity-100 md:pt-20">
                        {/* Skeleton for avatar */}
                        <div className="bg-secondary h-36 w-full max-w-28 animate-pulse rounded-t-lg md:h-48 md:max-w-36"></div>

                        {/* Skeleton for username */}
                        <div className="bg-secondary mb-5 h-8 w-1/2 animate-pulse rounded"></div>
                    </div>
                </div>
            </header>
        )
    }

    if (error) {
        return <div className="p-2 text-center text-red-500">{error}</div>
    }

    return (
        <header className="shadow-neu-inset-light-lg dark:shadow-neu-inset-dark-lg" style={bannerStyle}>
            <div className="flex h-full w-full items-end justify-center bg-white/20 dark:bg-black/30">
                <div className="flex w-5/6 max-w-screen-md items-end justify-start gap-5 pt-4 opacity-100 md:pt-20">
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

export default AnimeHeader
