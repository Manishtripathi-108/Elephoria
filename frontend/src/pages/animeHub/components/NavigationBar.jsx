import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Icon } from '@iconify/react'

import { logoutUser } from '../../../api/animeHubApi'
import { ConfirmationModal, openModal } from '../../../components/common/PrimaryModal'
import iconMap from '../../../constants/iconMap'
import { useAnimeHubContext } from '../../../context/AnimeHubContext'

const NavigationBar = () => {
    const { activeTab, setActiveTab } = useAnimeHubContext()
    const navigate = useNavigate()

    const handleLogOut = () => {
        logoutUser()
            .then(() => navigate('/anime-hub/auth'))
            .then(() => window.addToast('Logged out successfully', 'success'))
            .catch(() => window.addToast('Error logging out', 'error'))
    }

    return (
        <>
            <nav className="bg-primary mx-auto block w-full max-w-(--breakpoint-lg) px-4 py-2 lg:px-8 lg:py-3">
                <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-5">
                    <button
                        type="button"
                        title="Anime List"
                        onClick={() => setActiveTab('ANIME')}
                        className={`button ${activeTab === 'ANIME' ? 'active' : ''} inline-flex items-center justify-center gap-1 gap-2 px-2 py-2 text-sm text-nowrap md:gap-2 md:px-4 md:py-2 md:text-base`}>
                        <Icon icon={iconMap.anime} className="size-4 shrink-0 md:size-5" />
                        Anime List
                    </button>
                    <button
                        type="button"
                        title="Manga List"
                        onClick={() => setActiveTab('MANGA')}
                        className={`button ${activeTab === 'MANGA' ? 'active' : ''} inline-flex items-center justify-center gap-1 gap-2 px-2 py-2 text-sm text-nowrap md:gap-2 md:px-4 md:py-2 md:text-base`}>
                        <Icon icon={iconMap.manga} className="size-4 shrink-0 md:size-5" />
                        Manga List
                    </button>
                    <button
                        type="button"
                        title="Favourite List"
                        onClick={() => setActiveTab('FAVOURITES')}
                        className={`button ${activeTab === 'FAVOURITES' ? 'active' : ''} inline-flex items-center justify-center gap-1 gap-2 px-2 py-2 text-sm text-nowrap md:gap-2 md:px-4 md:py-2 md:text-base`}>
                        <Icon icon={iconMap.heart} className="size-4 shrink-0 md:size-5" />
                        Favourites
                    </button>
                    <button
                        type="button"
                        title="Favourite List"
                        onClick={() => setActiveTab('IMPORT')}
                        className={`button ${activeTab === 'IMPORT' ? 'active' : ''} inline-flex items-center justify-center gap-1 gap-2 px-2 py-2 text-sm text-nowrap md:gap-2 md:px-4 md:py-2 md:text-base`}>
                        <Icon icon={iconMap.upload} className="size-4 shrink-0 md:size-5" />
                        Import List
                    </button>
                    <button
                        type="button"
                        title="Log Out"
                        onClick={() => openModal('anime-hub-logout-modal')}
                        className="button inline-flex items-center justify-center gap-1 gap-2 px-2 py-2 text-sm text-nowrap text-red-500 md:gap-2 md:px-4 md:py-2 md:text-base dark:text-red-500">
                        <Icon icon={iconMap.logOut} className="size-4 shrink-0 md:size-5" />
                        Log Out
                    </button>
                </div>
            </nav>

            <ConfirmationModal
                modalId="anime-hub-logout-modal"
                icon={iconMap.error}
                confirmText="Log Out"
                isConfirmDanger={true}
                onConfirm={handleLogOut}
                cancelText="Cancel">
                Are you sure you want to log out?
            </ConfirmationModal>
        </>
    )
}

export default NavigationBar
