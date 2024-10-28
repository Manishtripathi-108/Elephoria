import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'

import useThemeMode from '../../../hooks/useThemeMode'

const ThemeToggleBtn = () => {
    const { theme, handleThemeChange } = useThemeMode()

    const buttonClass =
        'text-secondary hover:text-primary data-[state=active]:text-primary inline-flex h-[var(--sz)] max-h-[var(--sz)] min-h-[var(--sz)] w-[var(--sz)] min-w-[var(--sz)] max-w-[var(--sz)] items-center justify-center rounded-full border-light-secondary p-0.5 ring-offset-light-secondary transition-all [--sz:36px] hover:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-light-secondary focus-visible:ring-offset-1 active:shadow-neu-inset-light-xs disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:shadow-neu-light-xs data-[state=""]:hover:scale-105 data-[state=""]:active:scale-95 dark:border-dark-secondary dark:ring-offset-dark-secondary dark:focus-visible:ring-dark-secondary dark:active:shadow-neu-inset-dark-xs dark:data-[state=active]:shadow-neu-dark-xs'
    return (
        <div className="flex w-max items-center rounded-full border border-light-secondary p-1 dark:border-dark-secondary" title="Alt + X">
            <code className="sr-only pointer-events-none hidden select-none tracking-wide">Alt + X</code>
            <button
                className={`${buttonClass}`}
                onClick={() => handleThemeChange('dark')}
                aria-label="dark"
                data-state={theme === 'dark' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon="meteocons:clear-night-fill" className="size-6" />
            </button>
            <button
                className={`${buttonClass}`}
                onClick={() => handleThemeChange('system')}
                aria-label="system"
                data-state={theme === 'system' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon="noto:desktop-computer" className="size-4" />
            </button>
            <button
                className={`${buttonClass}`}
                onClick={() => handleThemeChange('light')}
                aria-label="light"
                data-state={theme === 'light' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon="meteocons:clear-day-fill" className="size-6" />
            </button>
        </div>
    )
}

export default ThemeToggleBtn
