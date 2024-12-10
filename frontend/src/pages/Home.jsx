import React from 'react'

import useNetworkStatus from '../hooks/useNetworkStatus'

const Home = () => {
    const isOnline = useNetworkStatus()

    return (
        <div className="flex-center h-calc-full-height flex-col">
            <h1 className="text-accent text-center text-4xl font-bold">{isOnline ? 'You are online' : 'You are offline'}</h1>
        </div>
    )
}

export default Home
