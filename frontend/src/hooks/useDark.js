import { useEffect, useState } from 'react'

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Initial check for dark mode preference
        const darkTheme = localStorage.getItem('dark')
        const userDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialDarkMode = darkTheme === 'true' || (!darkTheme && userDarkMode)
        setIsDarkMode(initialDarkMode)

        // Apply the initial dark mode
        if (initialDarkMode) {
            document.documentElement.classList.add('dark')
            setThemeColor('#1f2937') // Dark mode color
        } else {
            document.documentElement.classList.remove('dark')
            setThemeColor('#FFB6B9') // Light mode color
        }
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode
        setIsDarkMode(newDarkMode)

        if (newDarkMode) {
            document.documentElement.classList.add('dark')
            setThemeColor('#1f2937') // Set dark mode theme color
        } else {
            document.documentElement.classList.remove('dark')
            setThemeColor('#FFB6B9') // Set light mode theme color
        }

        // Save the user's preference in localStorage
        localStorage.setItem('dark', newDarkMode)
    }

    // Helper function to update theme color meta tag
    const setThemeColor = (color) => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color)
        }
    }

    return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
