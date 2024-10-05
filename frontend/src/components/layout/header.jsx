import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import AppName from '../../assets/svg/app-name'
import Logo from '../../assets/svg/logo'
import Sidenav from './sidenav'

// For hamburger icon

const Header = () => {
    const [isSidenavOpen, setIsSidenavOpen] = useState(false)

    const toggleSidenav = () => {
        if (isSidenavOpen) {
            const sidenav = document.getElementById('sidenav')
            if (sidenav) {
                sidenav.classList.remove('animate-slide-left-return')
                sidenav.classList.add('animate-slide-left')
            }
        }

        setIsSidenavOpen(!isSidenavOpen)
    }

    return (
        <>
            <header className="bg-primary shadow-neu-light-xs dark:shadow-neu-dark-xs flex items-center justify-start p-2">
                {/* Hamburger button */}
                <button
                    id="sidenav-toggle"
                    aria-controls="sidenav" // Identifies the controlled element (the sidenav)
                    aria-expanded={isSidenavOpen} // Indicates if the sidenav is open or closed
                    aria-label={isSidenavOpen ? 'Close menu' : 'Open menu'} // Label for screen readers
                    title={isSidenavOpen ? 'Close Sidenav' : 'Open Sidenav'}
                    type="button"
                    className="size-10 border border-light-secondary dark:border-dark-secondary flex-center group cursor-pointer flex-col rounded-lg shadow-neu-light-xs transition-shadow duration-300 active:shadow-neu-inset-light-md dark:shadow-neu-dark-md dark:active:shadow-neu-inset-dark-sm"
                    onClick={toggleSidenav}>
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? '-m-[1.5px] group-active:my-0.5 group-active:bg-highlight-primary group-active:rotate-0 first:-rotate-45 last:rotate-45 origin-center bg-accent-primary'
                                : 'my-0.5 bg-highlight-primary group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45 origin-center group-active:bg-accent-primary'
                        }`}></span>
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? '-m-[1.5px] group-active:my-0.5 group-active:bg-highlight-primary group-active:rotate-0 group-active:scale-100 scale-0 bg-accent-primary'
                                : 'my-0.5 bg-highlight-primary group-active:-m-[1.5px] group-active:scale-0 group-active:bg-accent-primary'
                        }`}></span>
                    <span
                        className={`h-[3px] w-1/2 rounded-md transition-all duration-300 ease-in-out ${
                            isSidenavOpen
                                ? '-m-[1.5px] group-active:my-0.5 group-active:bg-highlight-primary group-active:rotate-0 first:-rotate-45 last:rotate-45 origin-center bg-accent-primary'
                                : 'my-0.5 bg-highlight-primary group-active:-m-[1.5px] group-active:first:-rotate-45 group-active:last:rotate-45 origin-center group-active:bg-accent-primary'
                        }`}></span>
                </button>

                {/* Logo */}
                <Link to="/" aria-current={window.location.pathname === '/' ? 'page' : undefined} className="flex-center gap-2 ml-5 text-primary">
                    <Logo className="w-12" />
                    <AppName className="w-20" />
                </Link>
            </header>
            {/* Sidenav */}
            {isSidenavOpen && <Sidenav onDismiss={toggleSidenav} />}
        </>
    )
}

export default Header
