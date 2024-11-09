import React from 'react'

import { Icon } from '@iconify/react'

const GameOverModal = ({ clearBoard, isDraw, winner = '' }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            clearBoard()
        }
    }

    return (
        <div
            role="dialog"
            aria-label={isDraw ? "It's a draw!" : `${winner} wins!`}
            aria-live="assertive"
            tabIndex={0}
            onClick={clearBoard}
            onKeyDown={handleKeyDown}
            className="text-secondary flex-center invisible absolute left-0 top-0 z-10 flex h-full w-full animate-puff-in cursor-pointer flex-col items-center justify-center gap-8 rounded-lg border border-light-secondary font-indie-flower dark:border-dark-secondary">
            {/* Background Overlay */}
            <div className="bg-primary absolute left-0 top-0 h-full w-full opacity-70 blur-sm saturate-150"></div>

            <span className="text-accent-primary z-20 text-5xl font-bold tracking-wider">{isDraw ? "It's a draw!" : `${winner} wins!`}</span>

            <Icon icon="grommet-icons:power-reset" className="text-secondary z-20 size-1/6 shrink-0" />
            <span className="z-20 text-2xl tracking-wider">Play Again</span>
        </div>
    )
}

export default GameOverModal
