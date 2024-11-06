import React, { useEffect } from 'react'

import { Outlet, useLocation } from 'react-router-dom'

import { useLoadingBar } from '../../context/LoadingBarContext'
import ToastStack from '../common/notifications/ToastStack'
import Header from './Header'

function RootLayout() {
    const location = useLocation()
    const { startContinuous } = useLoadingBar()

    useEffect(() => {
        startContinuous(10, 500)
    }, [location])

    return (
        <>
            <Header />
            <Outlet /> {/* Renders the nested route components */}
            <ToastStack />
        </>
    )
}

export default RootLayout
