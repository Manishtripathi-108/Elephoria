import React from 'react'

import avatarImage from '../../../assets/images/portrait/lady-cute.png'

function AnimeHeader() {
    return (
        <header className="flex h-full items-end justify-center shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs">
            <div className="flex w-5/6 max-w-screen-md items-end justify-start gap-5 pt-4">
                <img src={avatarImage} alt="User Avatar" className="max-h-36 w-full max-w-28 rounded-t-lg align-text-top md:max-h-48 md:max-w-36" />
                <h1 className="text-primary mb-5 text-2xl font-bold">Anime</h1>
            </div>
        </header>
    )
}

export default AnimeHeader
