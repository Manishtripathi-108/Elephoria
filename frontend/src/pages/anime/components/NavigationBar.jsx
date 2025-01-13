import React from 'react'

import { NavLink } from 'react-router-dom'

import { Icon } from '@iconify/react/dist/iconify.js'

import APP_ROUTES from '../../../constants/appRoutes'
import iconMap from '../../../constants/iconMap'

const NavigationBar = () => {
    return (
        <nav className="fixed top-1/4 right-0 flex">
            <input type="checkbox" name="open-menu" id="open-menu" className="peer sr-only" />
            <label
                htmlFor="open-menu"
                className="bg-primary text-secondary hover:text-primary peer-checked:text-primary flex h-10 grow-0 cursor-pointer items-center justify-center rounded-l-lg border-y border-l p-2 sm:h-20">
                <Icon icon={iconMap.arrowOpenLeft} className="size-4" />
            </label>
            <div className="bg-primary text-secondary hidden place-items-center gap-4 rounded-tr-xl rounded-bl-xl border px-2 py-4 peer-checked:grid">
                <NavLink
                    to={APP_ROUTES.ANILIST.ANIME}
                    title="Anime List"
                    className={({ isActive }) => (isActive ? 'text-highlight' : 'hover:text-primary')}>
                    <Icon icon={iconMap.anime} className="size-6" />
                </NavLink>
                <NavLink
                    to={APP_ROUTES.ANILIST.MANGA}
                    title="Manga List"
                    className={({ isActive }) => (isActive ? 'text-highlight' : 'hover:text-primary')}>
                    <Icon icon={iconMap.manga} className="size-6" />
                </NavLink>
                <NavLink
                    to={APP_ROUTES.ANILIST.ANIME}
                    title="Import Anime/Manga"
                    className={({ isActive }) => (isActive ? 'text-highlight' : 'hover:text-primary')}>
                    <Icon icon={iconMap.upload} className="size-6" />
                </NavLink>
                <button type="button" title="Log Out">
                    <Icon icon={iconMap.logOut} className="size-6 text-red-500" />
                </button>
            </div>
        </nav>
    )
}

export default React.memo(NavigationBar)
