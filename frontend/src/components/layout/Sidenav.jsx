import React from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import avatarImage from '../../assets/images/square/logo.png'
import APP_ROUTES from '../../constants/appRoutes'
import iconMap from '../../constants/iconMap'

export const sidenavMenuItems = [
    {
        title: 'AniList',
        icon: iconMap.anime,
        children: [
            { name: 'Anime', link: APP_ROUTES.ANILIST.ANIME },
            { name: 'Manga', link: APP_ROUTES.ANILIST.MANGA },
        ],
    },
    {
        title: 'Games',
        icon: iconMap.gamePad,
        children: [
            {
                name: 'Tic Tac Toe',
                children: [
                    { name: 'Classic', link: APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC },
                    { name: 'Ultimate', link: APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE },
                ],
            },
            { name: 'Ludo', link: '/games/ludo' },
        ],
    },
    {
        title: 'Audio',
        icon: iconMap.music,
        children: [{ name: 'Music Editor', link: APP_ROUTES.AUDIO.TAGS_EXTRACTOR }],
    },
    {
        title: 'Profile',
        badge: 14,
        icon: iconMap.person,
        link: '/profile',
    },
]

const Sidenav = ({ onDismiss }) => {
    return (
        <dialog
            id="sidenav"
            className="bg-primary backdrop:bg-light-primary dark:backdrop:bg-dark-primary shadow-neumorphic-md my-auto flex h-screen w-72 -translate-x-full -translate-y-full scale-0 flex-col overflow-hidden rounded-e-lg opacity-0 transition-all transition-discrete duration-300 backdrop:opacity-65 backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300 open:translate-x-0 open:translate-y-0 open:scale-100 open:opacity-100 starting:open:-translate-x-full starting:open:-translate-y-full starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:opacity-0"
            onClick={(e) => e.target === e.currentTarget && onDismiss()}>
            {/* Profile Section */}
            <div className="flex items-center justify-between gap-4 border-b border-dotted p-4">
                <div className="flex items-center gap-3">
                    <img className="h-12 w-12 rounded-full" src={avatarImage} alt="Avatar" />
                    <div>
                        <p className="text-primary font-semibold">Roronoa Zoro</p>
                        <p className="text-secondary text-sm">Sword Master</p>
                    </div>
                </div>
                <button className="text-secondary hover:text-primary" onClick={onDismiss}>
                    <Icon icon={iconMap.close} className="size-6" />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="scrollbar-thin space-y-1 overflow-y-auto p-4">
                {sidenavMenuItems.map((item, index) => (
                    <div key={index}>
                        {/* Parent Item */}
                        <div className="group">
                            {item.link ? (
                                <Link
                                    to={item.link}
                                    onClick={onDismiss}
                                    className="hover:text-primary text-secondary font-aladin hover: hover:shadow-neumorphic-xs dark:hover:border-dark-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left tracking-widest transition">
                                    <div className="flex items-center gap-3">
                                        <Icon icon={item.icon} className="size-6" />
                                        <span className="flex-1">{item.title}</span>
                                    </div>
                                    {item.badge && <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>}
                                </Link>
                            ) : (
                                <>
                                    <input type="radio" name="menu" id={`menu-${index}`} className="peer hidden" />
                                    <label
                                        htmlFor={`menu-${index}`}
                                        className="peer-checked:text-primary hover:text-primary text-secondary font-aladin hover: hover:shadow-neumorphic-xs peer-checked: peer-checked:shadow-neumorphic-xs dark:hover:border-dark-secondary dark:peer-checked:border-dark-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left tracking-widest transition">
                                        <div className="flex items-center gap-3">
                                            <Icon icon={item.icon} className="size-6" />
                                            <span className="flex-1">{item.title}</span>
                                        </div>
                                        {item.children && (
                                            <Icon icon={iconMap.down} className="size-5 transition-transform peer-checked:rotate-180" />
                                        )}
                                        {item.badge && (
                                            <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>
                                        )}
                                    </label>
                                </>
                            )}

                            {/* Child Items */}
                            {item.children && (
                                <div className="max-h-0 overflow-hidden rounded-lg transition-all duration-300 ease-in-out peer-checked:max-h-screen peer-checked:px-1 peer-checked:py-2">
                                    {item.children.map((child, idx) => (
                                        <div key={idx} className="group pl-4">
                                            {child.link ? (
                                                <Link
                                                    to={child.link}
                                                    onClick={onDismiss}
                                                    className="text-secondary hover:text-primary hover: hover:shadow-neumorphic-xs dark:hover:border-dark-secondary flex w-full items-center gap-3 rounded-lg border border-transparent bg-inherit p-2 text-sm transition">
                                                    {child.name}
                                                </Link>
                                            ) : (
                                                <>
                                                    <input type="radio" name="sub-menu" id={`sub-menu-${index}`} className="peer hidden" />
                                                    <label
                                                        htmlFor={`sub-menu-${index}`}
                                                        className="peer-checked:text-primary hover:text-primary text-secondary hover: hover:shadow-neumorphic-xs peer-checked: peer-checked:shadow-neumorphic-xs dark:hover:border-dark-secondary dark:peer-checked:border-dark-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-2 text-left text-sm transition">
                                                        <div className="flex-1">{child.name}</div>
                                                        {child.children && (
                                                            <Icon
                                                                icon={iconMap.down}
                                                                className="size-5 transition-transform peer-checked:rotate-180"
                                                            />
                                                        )}
                                                    </label>
                                                </>
                                            )}

                                            {/* Sub-Children */}
                                            {child.children && (
                                                <div className="max-h-0 overflow-hidden rounded-lg transition-all duration-300 ease-in-out peer-checked:max-h-screen peer-checked:px-1 peer-checked:py-2">
                                                    {child.children.map((subChild, subIdx) => (
                                                        <Link
                                                            key={subIdx}
                                                            to={subChild.link}
                                                            onClick={onDismiss}
                                                            className="text-secondary hover:text-primary hover: hover:shadow-neumorphic-xs dark:hover:border-dark-secondary ml-4 block rounded-lg border border-transparent bg-inherit p-2 text-sm transition">
                                                            {subChild.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="border-t border-dotted"></div>

                <Link
                    onClick={onDismiss}
                    className="hover:text-primary text-secondary font-aladin hover: hover:shadow-neumorphic-xs dark:hover:border-dark-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left tracking-widest transition">
                    <div className="flex items-center gap-3">
                        <Icon icon={iconMap.settings} className="size-6" />
                        <span className="flex-1">Settings</span>
                    </div>
                </Link>

                <Link
                    onClick={onDismiss}
                    className="font-aladin hover: hover:shadow-neumorphic-xs dark:hover:border-dark-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left tracking-widest text-red-500 transition hover:text-red-600">
                    <div className="flex items-center gap-3">
                        <Icon icon={iconMap.logOut} className="size-6" />
                        <span className="flex-1">Log Out</span>
                    </div>
                </Link>
            </nav>
        </dialog>
    )
}

export default Sidenav
