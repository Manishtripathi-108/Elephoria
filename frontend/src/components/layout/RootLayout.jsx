import React, { useEffect } from 'react'

import { Outlet, useLocation } from 'react-router-dom'

import { useLoadingBar } from '../../context/LoadingBarContext'
import ToastStack from '../common/notifications/ToastStack'
import Header from './Header_2'

function RootLayout() {
    const location = useLocation()
    const { startContinuous } = useLoadingBar()
    const [prevPath, setPrevPath] = React.useState('')

    useEffect(() => {
        // if the location path is different from the previous one, start the loading bar
        if (location.pathname !== prevPath) {
            startContinuous(10, 500)
            setPrevPath(location.pathname)
        }
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
