import React from 'react'

import avatarImage from '../../assets/images/square/logo.png'

function Anime() {
    return (
        <div>
            <header className="flex h-40 items-end justify-center border border-white">
                <div className="container">
                    <img src={avatarImage} alt="User Avatar" className="size-32" />
                </div>
            </header>
        </div>
    )
}

export default Anime
