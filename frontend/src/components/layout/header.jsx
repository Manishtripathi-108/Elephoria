import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import NeuHamburgerBtn from '../common/buttons/NeuHamburgerBtn'
import ThemeToggleBtn from '../common/buttons/ThemeToggleBtn'
import Sidenav from './Sidenav'

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)

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

                {/* Theme Toggle */}
                <ThemeToggleBtn />
            </header>

            {/* Sidenav */}
            {isSidenavOpen && <Sidenav onDismiss={toggleSidenav} />}
        </>
    )
}

export default Header
