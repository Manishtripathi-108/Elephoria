import React, { useEffect, useState } from 'react'

import avatarImage from '../../../assets/images/portrait/lady-cute.png'
import fetchUserData from '../queries/fetchUserData'

function AnimeHeader() {
    const [userData, setUserData] = useState(null)
    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
        const getUserData = async () => {
            if (accessToken) {
                const data = await fetchUserData(accessToken)
                setUserData(data?.data?.Viewer)
            }
        }

        getUserData()
    }, [accessToken])

    const bannerStyle = {
        backgroundImage: `url(${userData?.bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    return userData ? (
        <header className="flex h-full items-end justify-center shadow-neu-inset-light-lg dark:shadow-neu-inset-dark-lg" style={bannerStyle}>
            <div className="flex w-5/6 max-w-screen-md items-end justify-start gap-5 pt-4">
                <img
                    src={userData?.avatar?.large}
                    alt={`${userData.name}'s avatar`}
                    className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36"
                />
                <h1 className="text-primary mb-5 text-2xl font-bold">{userData.name}</h1>
            </div>
        </header>
    ) : (
        <header className="flex h-full items-end justify-center shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs">
            <div className="flex w-5/6 max-w-screen-md items-end justify-start gap-5 pt-4">
                <img src={avatarImage} alt="User Avatar" className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36" />
                <h1 className="text-primary mb-5 text-2xl font-bold">Anime</h1>
            </div>
        </header>
    )
}

export default AnimeHeader
