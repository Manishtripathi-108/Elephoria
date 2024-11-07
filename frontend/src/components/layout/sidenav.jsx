import React from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import warriorImage from '../../assets/images/landscape/man-warrior.png'
import avatarImage from '../../assets/images/square/logo.png'

const menuItems = [
    {
        category: 'Game',
        items: [
            { name: 'Tic Tac Toe', url: '/games/tic-tac-toe' },
            { name: 'Tic Tac Toe Ultimate', url: '/games/tic-tac-toe/Ultimate' },
        ],
    },
    {
        category: 'Shadows',
        items: [{ name: 'Shadows Grid', url: '/shadows' }],
    },
    {
        category: 'Audio',
        items: [{ name: 'Music Editor', url: '/audio' }],
    },
    {
        category: 'Anime Hub',
        items: [
            { name: 'Anime Hub', url: '/anime-hub' },
            { name: 'Authorize', url: '/anime-hub/auth' },
        ],
    },
]

const Sidenav = ({ onDismiss }) => {
    return (
        <dialog
            id="sidenav"
            onClick={(e) => e.target === e.currentTarget && onDismiss()}
            className="bg-secondary animation-sideNav my-auto h-dvh w-72 overflow-hidden rounded-e-lg">
            <div className="flex flex-col border-l border-dashed border-l-light-primary dark:border-dark-primary">
                <button
                    aria-label="Close navigation"
                    className="text-secondary hover:text-primary bg-secondary dark:bg-secondary-dark absolute right-2 top-2 rounded-full border border-light-primary p-1 dark:border-dark-primary"
                    title="Close navigation"
                    onClick={onDismiss}>
                    <Icon icon="iconamoon:close" className="size-6" />
                </button>

                <h2 id="sidenav-heading" className="sr-only">
                    Main Navigation
                </h2>

                {/* Warrior Image */}
                <div className="flex h-28 w-full shrink-0 items-center justify-between">
                    <a className="h-full w-full transition-colors duration-200 ease-in-out" href="#">
                        <img className="size-full overflow-hidden object-cover object-center" src={warriorImage} alt="Warrior" loading="lazy" />
                    </a>
                </div>

                <div className="border-b border-dashed border-light-primary dark:border-dark-primary lg:block"></div>

                {/* User Info */}
                <div className="flex items-center justify-between gap-x-4 p-4">
                    <div className="inline-flex items-start gap-x-4">
                        <div className="block shrink-0">
                            <div className="cursor-pointer">
                                <img className="size-11 rounded-lg" src={avatarImage} alt="Avatar Image" />
                            </div>
                        </div>
                        <div className="mr-2">
                            <a className="text-primary text-base font-medium" href="">
                                Roronoa Zoro
                            </a>
                            <span className="text-secondary block text-xs font-medium">Sword Master</span>
                        </div>
                    </div>
                    <a
                        className="hover:text-primary mr-2 cursor-pointer border-0 text-center align-middle text-sm font-medium text-red-500 transition-colors duration-150 ease-in-out"
                        href="">
                        Logout
                    </a>
                </div>

                <div className="border-b border-dashed border-light-primary dark:border-dark-primary lg:block"></div>

                {/* Menu Items */}
                <div className="scrollbar-thin relative my-5 overflow-y-scroll md:pl-3">
                    <div className="flex w-full flex-col font-medium">
                        {menuItems
                            .sort((a, b) => a.category.localeCompare(b.category))
                            .map((menu, menuIndex) => (
                                <div key={menuIndex} className="block px-4 pb-2">
                                    {/* Section Heading */}
                                    <span className="text-secondary-dark text-primary font-semibold uppercase">{menu.category}</span>

                                    {/* Sub Links */}
                                    {menu.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="my-1 flex cursor-pointer select-none items-center py-2">
                                            <Link
                                                onClick={onDismiss}
                                                aria-current={window.location.pathname === item.url ? 'page' : undefined}
                                                className="text-secondary flex flex-grow items-center text-sm hover:text-dark-primary dark:hover:text-light-primary"
                                                to={item.url}>
                                                {item.name}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default Sidenav
