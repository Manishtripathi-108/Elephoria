import React from 'react'

import { Outlet, useNavigation } from 'react-router-dom'

import ToastStack from '../common/notifications/ToastStack'
import Header from './Header'

function RootLayout() {
    return (
        <>
            <Header />
            <Outlet /> {/* Renders the nested route components */}
            <ToastStack />
        </>
    )
}

export default RootLayout
