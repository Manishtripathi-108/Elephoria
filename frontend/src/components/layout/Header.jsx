import React, { useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppLogo from '../../assets/svg/AppLogo'
import AppName from '../../assets/svg/AppName'
import NeuToggleButton from '../common/buttons/NeuToggleButton'
import ThemeToggleBtn from '../common/buttons/ThemeToggleBtn'
import Sidenav from './Sidenav'

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)
    const location = useLocation()
    const headerHeight = 64

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
            const currentScrollY = window.scrollY
            // Show header when scrolling up or back to the top
            if (currentScrollY < lastScrollY || currentScrollY <= headerHeight) {
                header.style.transform = 'translateY(0)'
                header.style.opacity = '1'
            }
            // Hide header when scrolling down past the header height
            else if (currentScrollY > headerHeight) {
                header.style.transform = 'translateY(-100%)'
                header.style.opacity = '0'
            }

            lastScrollY = currentScrollY
        }

        // Debounce scroll event for better performance
        const debouncedScroll = () => {
            window.requestAnimationFrame(handleScroll)
        }

        window.addEventListener('scroll', debouncedScroll)

        return () => {
            window.removeEventListener('scroll', debouncedScroll)
        }
    }, [])

    return (
        <>
            <header
                id="page-header"
                className="bg-primary sticky top-0 z-50 mb-0.5 flex h-[var(--header-height)] w-full items-center justify-between p-2 shadow-neumorphic-xs transition-all duration-300 ease-in-out">
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
                    <AppLogo className="w-12" />
                    <AppName className="w-20" />
                </Link>

                <ThemeToggleBtn />
            </header>

            <Sidenav onDismiss={toggleSidenav} />
        </>
    )
}

export default Header
