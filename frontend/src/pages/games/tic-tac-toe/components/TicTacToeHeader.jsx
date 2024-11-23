import React from 'react'

import { Link } from 'react-router-dom'

import ElevateButton from '../../../../components/common/buttons/ElevateButton'

const TicTacToeHeader = ({ title, playingOnline }) => {
    return (
        <div className="grid grid-cols-2 border-b border-light-secondary py-3 dark:border-dark-secondary">
            <h1 className="text-primary flex-center text-center text-lg font-bold tracking-wider md:text-2xl">{title}</h1>
            <div className="flex-center gap-3">
                <Link to="/games/tic-tac-toe/classic" aria-disabled>
                    <ElevateButton>
                        <span className="text-sm font-semibold tracking-wider">Classic</span>
                    </ElevateButton>
                </Link>
                <Link to="/games/tic-tac-toe/ultimate">
                    <ElevateButton>
                        <span className="text-sm font-semibold tracking-wider">Ultimate</span>
                    </ElevateButton>
                </Link>
                {!playingOnline && (
                    <ElevateButton
                        onClick={() => {
                            const playModal = document.getElementById('play_online')
                            if (playModal) playModal.showModal()
                        }}>
                        <span className="text-sm font-semibold tracking-wider">Play Online</span>
                    </ElevateButton>
                )}
            </div>
        </div>
    )
}

export default React.memo(TicTacToeHeader)
