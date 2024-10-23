import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'

function AnimeNav({ currentTab }) {
    const [activeTab, setActiveTab] = useState('ANIME')

    const navigate = useNavigate()

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        currentTab(tab)
    }

    const handleLogOut = () => {
        if (localStorage.getItem('accessToken')) {
            localStorage.removeItem('accessToken')
            window.addToast('Logged out successfully', 'success')
            navigate('/anime/auth')
        } else {
            // If there's no accessToken in localStorage
            window.addToast('Error logging out', 'error')
        }
    }

    return (
        <nav className="bg-primary mx-auto block w-full max-w-screen-lg px-4 py-2 lg:px-8 lg:py-3">
            <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-5">
                <button
                    type="button"
                    title="Anime List"
                    onClick={() => handleTabChange('ANIME')}
                    className={`neu-btn ${activeTab === 'ANIME' ? 'active' : ''} neu-icon-btn gap-1 text-nowrap px-2 py-2 md:gap-2 md:px-4 md:py-2 md:text-base`}>
                    <svg fill="currentColor" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0 md:size-5">
                        <path
                            d="M38.892 14.296C26.973 19.323 15.061 32.693 15.01 41.102c-.009 1.359-2.437 8.367-13.59 39.218L.039 84.141l27.731-.321c31.091-.359 32.628-.667 41.006-8.237 18.829-17.01 3.415-50.678-20.822-45.48-20.01 4.292-21.144 34.431-1.379 36.658 12.603 1.421 18.192-11.422 8.707-20.006-1.841-1.666-2.037-1.62-4.623 1.079-2.699 2.817-2.699 2.82-.68 4.647 4.522 4.092 1.159 8.906-4.439 6.355-6.306-2.873-7.474-12.102-2.199-17.377 13.386-13.386 34.151 8.644 23.31 24.731-16.699 24.779-55.114-1.28-42.293-28.69 8.743-18.692 31.564-23.429 50.15-10.41l5.702 3.995 7.395-5.566c8.152-6.136 8.232-6.278 5.458-9.658-2.098-2.557-1.74-2.656-8.938 2.474l-3.978 2.835-8.663-4.293c-11.285-5.592-23.213-6.537-32.592-2.581M16 62.281c0 .371-1.105 3.609-2.455 7.196L11.09 76h15.259l-2.071-2.25c-1.138-1.237-3.467-4.476-5.174-7.196C17.397 63.834 16 61.911 16 62.281"
                            fillRule="evenodd"></path>
                    </svg>
                    Anime List
                </button>
                <button
                    type="button"
                    title="Manga List"
                    onClick={() => handleTabChange('MANGA')}
                    className={`neu-btn ${activeTab === 'MANGA' ? 'active' : ''} neu-icon-btn gap-1 text-nowrap px-2 py-2 md:gap-2 md:px-4 md:py-2 md:text-base`}>
                    <svg
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 shrink-0 md:size-5">
                        <path d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z"></path>
                    </svg>
                    Manga List
                </button>
                <button
                    type="button"
                    title="Favorite List"
                    onClick={() => handleTabChange('FAVORITES')}
                    className={`neu-btn ${activeTab === 'FAVORITES' ? 'active' : ''} neu-icon-btn gap-1 text-nowrap px-2 py-2 md:gap-2 md:px-4 md:py-2 md:text-base`}>
                    <Icon icon="icomoon-free:heart" className="size-4 shrink-0 md:size-5" />
                    Favorites
                </button>
                <button
                    type="button"
                    title="Favorite List"
                    onClick={() => handleTabChange('IMPORT')}
                    className={`neu-btn ${activeTab === 'IMPORT' ? 'active' : ''} neu-icon-btn gap-1 text-nowrap px-2 py-2 md:gap-2 md:px-4 md:py-2 md:text-base`}>
                    <Icon icon="icomoon-free:heart" className="size-4 shrink-0 md:size-5" />
                    Import List
                </button>
                <button
                    type="button"
                    title="Log Out"
                    onClick={() => handleLogOut()}
                    className="neu-btn neu-icon-btn gap-1 text-nowrap px-2 py-2 text-red-500 dark:text-red-500 md:gap-2 md:px-4 md:py-2 md:text-base">
                    <Icon icon="majesticons:logout" className="size-4 shrink-0 md:size-5" />
                    Log Out
                </button>
            </div>
        </nav>
    )
}

export default AnimeNav
