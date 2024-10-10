import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import useDarkMode from '../../hooks/useDark'
import NeuHamburgerBtn from '../common/buttons/NeuHamburgerBtn'
import Sidenav from './sidenav'

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
                <NeuHamburgerBtn
                    id="sidenav-toggle"
                    aria-controls="sidenav"
                    aria-expanded={isSidenavOpen}
                    aria-label={isSidenavOpen ? 'Close menu' : 'Open menu'}
                    title={isSidenavOpen ? 'Close Sidenav' : 'Open Sidenav'}
                    type="button"
                    onClick={toggleSidenav}
                    isActive={isSidenavOpen}
                />

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
