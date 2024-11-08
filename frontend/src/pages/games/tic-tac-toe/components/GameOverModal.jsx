import React from 'react'

import { Icon } from '@iconify/react'

const GameOverModal = ({ initializeGame, isDraw, winner = '' }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            initializeGame()
        }
    }

    return (
        <div
            role="dialog"
            aria-label={isDraw ? "It's a draw!" : `${winner} wins!`}
            aria-live="assertive"
            tabIndex={0}
            onClick={initializeGame}
            onKeyDown={handleKeyDown}
            className="text-secondary flex-center invisible absolute left-0 top-0 z-10 flex h-full w-full animate-puff-in cursor-pointer flex-col items-center justify-center gap-8 font-indie-flower">
            {/* Background Overlay */}
            <div className="bg-secondary absolute left-0 top-0 h-full w-full opacity-70 blur-sm saturate-150"></div>

            <span className="text-accent-primary z-20 text-5xl font-bold tracking-wider">{isDraw ? "It's a draw!" : `${winner} wins!`}</span>

            <Icon icon="grommet-icons:power-reset" className="text-primary size-2/6 shrink-0" />
            <span className="z-20 text-2xl tracking-wider">Play Again</span>
        </div>
    )
}

export default GameOverModal
