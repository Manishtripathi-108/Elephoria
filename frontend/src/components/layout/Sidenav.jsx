import React from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import avatarImage from '../../assets/images/square/logo.png'
import { iconMap } from '../../utils/globalConstants'

const menuItems = [
    {
        title: 'Anime Hub',
        icon: iconMap.gamePad,
        children: [
            { name: 'Anime Hub', link: '/anime-hub' },
            { name: 'Authorize', link: '/anime-hub/auth' },
        ],
    },
    {
        title: 'Games',
        icon: iconMap.gamePad,
        children: [
            {
                name: 'Tic Tac Toe',
                children: [
                    { name: 'Classic', link: '/games/tic-tac-toe/classic' },
                    { name: 'Ultimate', link: '/games/tic-tac-toe/ultimate' },
                ],
            },
            { name: 'Snake', link: '/games/snake' },
            { name: 'Ludo', link: '/games/ludo' },
        ],
    },
    {
        title: 'Audio',
        icon: iconMap.music,
        children: [{ name: 'Music Editor', link: '/audio' }],
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
            className="side-nav-animation bg-primary my-auto flex h-screen w-72 flex-col overflow-hidden rounded-e-lg shadow-neu-light-md dark:shadow-neu-dark-md"
            onClick={(e) => e.target === e.currentTarget && onDismiss()}>
            {/* Profile Section */}
            <div className="flex items-center justify-between gap-4 border-b border-dotted border-light-secondary p-4 dark:border-dark-secondary">
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
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {/* Parent Item */}
                        <div className="group">
                            {item.link ? (
                                <Link
                                    to={item.link}
                                    onClick={onDismiss}
                                    className="hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs">
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
                                        className="peer-checked:text-primary hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neu-light-xs peer-checked:border-light-secondary peer-checked:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs dark:peer-checked:border-dark-secondary dark:peer-checked:shadow-neu-dark-xs">
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
                                                    className="text-secondary hover:text-primary flex w-full items-center gap-3 rounded-lg border border-transparent bg-inherit p-2 text-sm transition hover:border-light-secondary hover:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs">
                                                    {child.name}
                                                </Link>
                                            ) : (
                                                <>
                                                    <input type="radio" name="sub-menu" id={`sub-menu-${index}`} className="peer hidden" />
                                                    <label
                                                        htmlFor={`sub-menu-${index}`}
                                                        className="peer-checked:text-primary hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-2 text-left text-sm transition hover:border-light-secondary hover:shadow-neu-light-xs peer-checked:border-light-secondary peer-checked:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs dark:peer-checked:border-dark-secondary dark:peer-checked:shadow-neu-dark-xs">
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
                                                            className="text-secondary hover:text-primary ml-4 block rounded-lg border border-transparent bg-inherit p-2 text-sm transition hover:border-light-secondary hover:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs">
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

                <div className="border-t border-dotted border-light-secondary dark:border-dark-secondary"></div>

                <Link
                    onClick={onDismiss}
                    className="hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs">
                    <div className="flex items-center gap-3">
                        <Icon icon={iconMap.settings} className="size-6" />
                        <span className="flex-1">Settings</span>
                    </div>
                </Link>

                <Link
                    onClick={onDismiss}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest text-red-500 transition hover:border-light-secondary hover:text-red-600 hover:shadow-neu-light-xs dark:hover:border-dark-secondary dark:hover:shadow-neu-dark-xs">
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
