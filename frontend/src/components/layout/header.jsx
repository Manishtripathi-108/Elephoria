import React, { useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import NeuToggleButton from '../common/buttons/NeuToggleButton'
import ThemeToggleBtn from '../common/buttons/ThemeToggleBtn'
import Sidenav from './Sidenav'

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)
    const location = useLocation()

    // Toggle Sidenav visibility
    const toggleSidenav = () => {
        setIsSidenavOpen((prev) => !prev)
        const sidenav = document.getElementById('sidenav')
        if (sidenav) {
            isSidenavOpen ? sidenav.close() : sidenav.showModal()
        }
    }

    useEffect(() => {
        const header = document.getElementById('page-header')
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)'
                header.style.opacity = '0'
            } else {
                header.style.transform = 'translateY(0)'
                header.style.opacity = '1'
            }
            lastScrollY = window.scrollY
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>
            <header
                id="page-header"
                className="bg-primary fixed top-0 z-50 flex w-full items-center justify-between p-2 shadow-neu-light-xs transition-all duration-300 ease-in-out dark:shadow-neu-dark-xs">
                <NeuToggleButton
                    id="sidenav-toggle"
                    aria-controls="sidenav"
                    aria-expanded={isSidenavOpen}
                    aria-label={isSidenavOpen ? 'Close menu' : 'Open menu'}
                    title={isSidenavOpen ? 'Close Sidenav' : 'Open Sidenav'}
                    handleClick={toggleSidenav}
                    active={isSidenavOpen}
                    alignment="left"
                />

                <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined} className="text-primary ml-5 flex items-center gap-2">
                    <Logo className="w-12" />
                    <AppName className="w-20" />
                </Link>

                <ThemeToggleBtn />
            </header>

            <Sidenav onDismiss={toggleSidenav} />
        </>
    )
}

export default Header
