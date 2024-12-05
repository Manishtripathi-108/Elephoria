import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'
import useNetworkStatus from '../../../../hooks/useNetworkStatus'

const TicTacToeHeader = ({ title, playingOnline }) => {
    const isInternetConnected = useNetworkStatus()

    useEffect(() => {
        if (isInternetConnected) {
            window.addToast('You are online.', 'success')
        } else {
            window.addToast('You are offline, if you want to play online mode, please connect to the internet.', 'error', 10000)
        }
    }, [isInternetConnected])

    return (
        <div
            className={`grid border-b border-light-secondary py-3 dark:border-dark-secondary md:grid-cols-2 ${playingOnline ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <h1 className="text-primary flex-center text-center text-lg font-bold capitalize tracking-wider md:text-2xl">{title}</h1>
            <div className={`flex-center flex-wrap gap-3 md:col-span-1 ${playingOnline ? '' : 'col-span-3'}`}>
                <Link to="/games/tic-tac-toe/classic" tabIndex={-1}>
                    <ElevateButton>Classic</ElevateButton>
                </Link>
                <Link to="/games/tic-tac-toe/ultimate" tabIndex={-1}>
                    <ElevateButton>Ultimate</ElevateButton>
                </Link>
                {!playingOnline && (
                    <ElevateButton
                        onClick={() => {
                            if (!isInternetConnected) {
                                window.addToast('Please connect to the internet to play online.', 'error')
                                return
                            }
                            const playModal = document.getElementById('play_online')
                            if (playModal) playModal.showModal()
                        }}>
                        Play Online
                    </ElevateButton>
                )}
            </div>
        </div>
    )
}

export default React.memo(TicTacToeHeader)
