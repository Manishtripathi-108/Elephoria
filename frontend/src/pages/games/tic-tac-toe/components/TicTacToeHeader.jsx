import React from 'react'

import { Link } from 'react-router-dom'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'
import useNetworkStatus from '../../../../hooks/useNetworkStatus'

const TicTacToeHeader = ({ title, playingOnline }) => {
    const isInternetConnected = useNetworkStatus()

    return (
        <div
            className={`border-light-secondary dark:border-dark-secondary grid border-b py-3 md:grid-cols-2 ${playingOnline ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <h1 className="text-primary flex items-center justify-center text-center text-lg font-bold tracking-wider capitalize md:text-2xl">
                {title}
            </h1>
            <div className={`flex flex-wrap items-center justify-center gap-3 md:col-span-1 ${playingOnline ? '' : 'col-span-3'}`}>
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
