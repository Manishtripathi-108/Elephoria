import { useEffect, useState } from 'react'

const useThemeMode = () => {
    const [theme, setTheme] = useState('system') // Options: 'light' | 'dark' | 'system'

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'system'
        setTheme(storedTheme)

        if (storedTheme === 'system') {
            applySystemTheme()
        } else {
            applyTheme(storedTheme)
        }
    }, [])

    useEffect(() => {
        if (theme === 'system') {
            const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)')
            systemThemeListener.addEventListener('change', applySystemTheme)
            return () => systemThemeListener.removeEventListener('change', applySystemTheme)
        }
    }, [theme])

    // Add keyboard shortcut to cycle through themes (Alt + X)
    useEffect(() => {
        const handleShortcut = (event) => {
            if (event.altKey && event.key.toLowerCase() === 'x') {
                cycleTheme()
            }
        }
        window.addEventListener('keydown', handleShortcut)
        return () => window.removeEventListener('keydown', handleShortcut)
    }, [theme])

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light')
        }

        setThemeColor()
    }

    const applySystemTheme = () => {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        applyTheme(systemPrefersDark ? 'dark' : 'light')
    }

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        if (newTheme === 'system') {
            applySystemTheme()
        } else {
            applyTheme(newTheme)
        }
    }

    const cycleTheme = () => {
        const themes = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        handleThemeChange(nextTheme)
    }

    const setThemeColor = () => {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
        document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
    }

    return { theme, handleThemeChange, cycleTheme }
}

export default useThemeMode
