import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import APP_ROUTES from '../constants/app.constants'
import useAuthToken from '../context/AuthTokenContext'
import Loading from './Loading'

/**
 * ProtectedRoute Component
 * Redirects users based on their authentication status and type.
 *
 * @param {React.ReactNode} children - The content to render if the user passes the authentication check.
 * @param {string} type - The type of authentication to validate (e.g., 'user', 'admin').
 * @param {boolean} [reverse=false] - If true, redirects authenticated users instead of unauthenticated ones.
 * @returns {React.ReactNode} The children or a redirection.
 */
const ProtectedRoute = ({ children, type, reverse = false }) => {
    const { loading, isAuth } = useAuthToken()
    const navigate = useNavigate()

    // Helper to determine if the user satisfies the authentication condition
    const isAuthorized = reverse ? !isAuth?.[type.toLowerCase()] : isAuth?.[type.toLowerCase()]

    // Get the appropriate redirection route
    const getRedirectRoute = () => {
        const typeKey = type.toUpperCase()
        if (reverse) {
            return APP_ROUTES[typeKey]?.INDEX || '/'
        } else {
            window.addToast(`Please login to ${typeKey} to continue`, 'info')
            return APP_ROUTES[typeKey]?.LOGIN || '/login'
        }
    }

    useEffect(() => {
        if (!loading && !isAuthorized) {
            navigate(getRedirectRoute(), { replace: true })
        }
    }, [loading, isAuthorized, navigate])

    // Show loading state while authentication status is being determined
    if (loading) return <Loading />

    // Render children if authorized, otherwise render nothing
    return isAuthorized ? children : null
}

export default ProtectedRoute
