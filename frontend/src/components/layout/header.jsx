import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import Sidenav from './sidenav'

const useDarkMode = () => {
    // State to track whether dark mode is enabled
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Check localStorage and system preferences for dark mode
        const darkTheme = localStorage.getItem('dark')
        const userDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialDarkMode = darkTheme === 'true' || (!darkTheme && userDarkMode)
        setIsDarkMode(initialDarkMode) // Set the initial dark mode state

        if (initialDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode
        setIsDarkMode(newDarkMode)

        if (newDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        // Save the user's preference in localStorage
        localStorage.setItem('dark', newDarkMode)
    }

    return { isDarkMode, toggleDarkMode }
}

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    const toggleSidenav = () => {
        setIsSidenavOpen((prev) => !prev)

        const sidenav = document.getElementById('sidenav')
        if (sidenav) {
            if (isSidenavOpen) {
                sidenav.classList.remove('animate-slide-left-return')
                sidenav.classList.add('animate-slide-left')
            } else {
                sidenav.classList.remove('animate-slide-left')
                sidenav.classList.add('animate-slide-left-return')
            }
        }
    }

    // Add keyboard shortcut to toggle dark mode (Alt + X)
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'x' && e.altKey) {
                toggleDarkMode()
            }
        }

        document.addEventListener('keydown', handleKeydown)

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeydown)
        }
    }, [toggleDarkMode])

    return (
        <>
            <header className="bg-primary flex items-center justify-between p-2 shadow-neu-light-xs dark:shadow-neu-dark-xs">
                {/* Hamburger button */}
                <button
                    id="sidenav-toggle"
                    aria-controls="sidenav"
                    aria-expanded={isSidenavOpen}
                    aria-label={isSidenavOpen ? 'Close menu' : 'Open menu'}
                    title={isSidenavOpen ? 'Close Sidenav' : 'Open Sidenav'}
                    type="button"
                    className="flex-center group size-10 cursor-pointer flex-col rounded-lg border border-light-secondary shadow-neu-light-xs transition-shadow duration-300 active:shadow-neu-inset-light-md dark:border-dark-secondary dark:shadow-neu-dark-md dark:active:shadow-neu-inset-dark-sm"
                    onClick={toggleSidenav}>
                    {/* Hamburger lines */}
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                                : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                        }`}></span>
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] scale-0 group-active:my-0.5 group-active:rotate-0 group-active:scale-100'
                                : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 group-active:-m-[1.5px] group-active:scale-0'
                        }`}></span>
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? 'group-active:bg-highlight-primary bg-accent-primary -m-[1.5px] origin-center first:-rotate-45 last:rotate-45 group-active:my-0.5 group-active:rotate-0'
                                : 'bg-highlight-primary group-active:bg-accent-primary my-0.5 origin-center group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45'
                        }`}></span>
                </button>

                {/* Logo */}
                <Link to="/" aria-current={window.location.pathname === '/' ? 'page' : undefined} className="flex-center text-primary ml-5 gap-2">
                    <Logo className="w-12" />
                    <AppName className="w-20" />
                </Link>

                {/* Dark Mode Toggle */}
                <button className="neu-btn neu-icon-only-btn ml-auto" onClick={toggleDarkMode} aria-label="Toggle dark mode" title="Toggle dark mode">
                    {isDarkMode ? (
                        <Icon icon="meteocons:clear-day-fill" className="size-6" />
                    ) : (
                        <Icon icon="meteocons:clear-night-fill" className="size-6" />
                    )}
                </button>
            </header>

            {/* Sidenav */}
            {isSidenavOpen && <Sidenav onDismiss={toggleSidenav} />}
        </>
    )
}

export default Header
