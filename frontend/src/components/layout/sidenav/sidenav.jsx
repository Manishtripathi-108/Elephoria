import React from 'react'

import { Link } from 'react-router-dom'

import warriorImage from '../../../assets/images/landscape/man-warrior.png'
import avatarImage from '../../../assets/images/square/animal-orange-bird.png'

const menuItems = [
    {
        category: 'Game',
        items: [
            { name: 'Tic Tac Toe', url: '/games/tic-tac-toe' },
            { name: 'Tic Tac Toe Ultimate', url: '/games/tic-tac-toe/Ultimate' },
        ],
    },
    // {
    //     category: 'Authentication',
    //     items: [{ name: 'Login/Signup', url: '/auth' }]
    // },
    {
        category: 'Shadows',
        items: [{ name: 'Shadows Grid', url: '/shadows' }],
    },
    {
        category: 'Audio',
        items: [{ name: 'Music Editor', url: '/audio' }],
    },
    {
        category: 'Anime',
        items: [{ name: 'Anime', url: '/anime' }],
    },
]

const Sidenav = () => {
    return (
        <div className="relative h-[700px]">
            <aside className="group/sidebar bg-secondary fixed inset-y-0 left-0 z-40 m-0 flex w-[250px] shrink-0 flex-col overflow-hidden rounded-lg border-r border-dashed border-r-light-primary transition-all duration-300 ease-in-out lg:w-[300px] dark:border-dark-primary">
                <div className="flex h-28 w-full shrink-0 items-center justify-between">
                    <a className="h-full w-full transition-colors duration-200 ease-in-out" href="#">
                        <img className="size-full overflow-hidden object-cover object-center" src={warriorImage} alt="Warrior" />
                    </a>
                </div>

                <div className="border-b border-dashed border-light-primary lg:block dark:border-dark-primary"></div>

                <div className="flex items-center justify-between gap-2 px-4 py-5 md:gap-5 md:px-6">
                    <div className="inline-flex items-start gap-2 md:gap-5">
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
                        className="text-secondary relative inline-flex cursor-pointer items-center justify-end border-0 text-center align-middle text-base font-medium transition-colors duration-150 ease-in-out"
                        href="">
                        <span className="mr-2 inline-block text-sm">Logout</span>
                    </a>
                </div>

                <div className="border-b border-dashed border-light-primary lg:block dark:border-dark-primary"></div>

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
            </aside>
        </div>
    )
}

export default Sidenav
