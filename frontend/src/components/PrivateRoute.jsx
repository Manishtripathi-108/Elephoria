import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import APP_ROUTES from '../constants/appRoutes'
import { useAuthToken } from '../context/AuthTokenProvider'
import Loading from './Loading'

const ProtectedRoute = ({ children, isAnilistRoute = false }) => {
    const { loading, isAuth } = useAuthToken()
    const navigate = useNavigate()
    console.log('ProtectedRoute:', { loading, isAuth, isAnilistRoute })

    useEffect(() => {
        if (loading) return
        if (isAnilistRoute && !isAuth.anilist) {
            console.log('Navigating to Anilist login route')
            window.addToast('Please login to Anilist to continue', 'info')
            navigate(APP_ROUTES.ANIME.LOGIN, { replace: true })
        } else if (!isAnilistRoute && !isAuth.app) {
            console.log('Navigating to root login route')
            navigate(APP_ROUTES.ROOT, { replace: true })
        }
    }, [loading, isAuth, isAnilistRoute, navigate])

    if (loading) return <Loading />

    // Render children only if isAuth are valid
    if ((isAnilistRoute && !isAuth.anilist) || (!isAnilistRoute && !isAuth.app)) return null

    return children
}

export default ProtectedRoute
