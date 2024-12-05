import React from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import avatarImage from '../../assets/images/square/logo.png'
import { iconMap, sidenavMenuItems } from '../../utils/globalConstants'

const Sidenav = ({ onDismiss }) => {
    return (
        <dialog
            id="sidenav"
            className="side-nav-animation bg-primary my-auto flex h-screen w-72 flex-col overflow-hidden rounded-e-lg shadow-neumorphic-md"
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
                {sidenavMenuItems.map((item, index) => (
                    <div key={index}>
                        {/* Parent Item */}
                        <div className="group">
                            {item.link ? (
                                <Link
                                    to={item.link}
                                    onClick={onDismiss}
                                    className="hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neumorphic-xs dark:hover:border-dark-secondary">
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
                                        className="peer-checked:text-primary hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neumorphic-xs peer-checked:border-light-secondary peer-checked:shadow-neumorphic-xs dark:hover:border-dark-secondary dark:peer-checked:border-dark-secondary">
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
                                                    className="text-secondary hover:text-primary flex w-full items-center gap-3 rounded-lg border border-transparent bg-inherit p-2 text-sm transition hover:border-light-secondary hover:shadow-neumorphic-xs dark:hover:border-dark-secondary">
                                                    {child.name}
                                                </Link>
                                            ) : (
                                                <>
                                                    <input type="radio" name="sub-menu" id={`sub-menu-${index}`} className="peer hidden" />
                                                    <label
                                                        htmlFor={`sub-menu-${index}`}
                                                        className="peer-checked:text-primary hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-2 text-left text-sm transition hover:border-light-secondary hover:shadow-neumorphic-xs peer-checked:border-light-secondary peer-checked:shadow-neumorphic-xs dark:hover:border-dark-secondary dark:peer-checked:border-dark-secondary">
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
                                                            className="text-secondary hover:text-primary ml-4 block rounded-lg border border-transparent bg-inherit p-2 text-sm transition hover:border-light-secondary hover:shadow-neumorphic-xs dark:hover:border-dark-secondary">
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
                    className="hover:text-primary text-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest transition hover:border-light-secondary hover:shadow-neumorphic-xs dark:hover:border-dark-secondary">
                    <div className="flex items-center gap-3">
                        <Icon icon={iconMap.settings} className="size-6" />
                        <span className="flex-1">Settings</span>
                    </div>
                </Link>

                <Link
                    onClick={onDismiss}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left font-aladin tracking-widest text-red-500 transition hover:border-light-secondary hover:text-red-600 hover:shadow-neumorphic-xs dark:hover:border-dark-secondary">
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
