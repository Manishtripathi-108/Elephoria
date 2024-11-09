import React, { useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import NeuToggleButton from '../common/buttons/NeuToggleButton'
import ThemeToggleBtn from '../common/buttons/ThemeToggleBtn'
import Sidenav from './Sidenav'

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
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
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show header when scrolling up or back to the top
            if (currentScrollY < lastScrollY || currentScrollY <= headerHeight) {
                setIsHidden(false)
            }
            // Hide header when scrolling down past the header height
            else if (currentScrollY > headerHeight) {
                setIsHidden(true)
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
                className={`bg-primary top-0 z-50 flex w-full items-center justify-between p-2 opacity-100 shadow-neu-light-xs transition-transform duration-300 ease-in-out dark:shadow-neu-dark-xs ${
                    isHidden ? '-translate-y-full opacity-0' : 'translate-y-0'
                }`}
                style={{ position: 'sticky' }}>
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
