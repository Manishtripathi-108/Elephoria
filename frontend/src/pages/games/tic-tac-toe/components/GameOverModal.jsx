import React from 'react'

import { Icon } from '@iconify/react'

import { iconMap } from '../../../../utils/globalConstants'

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
            className="text-secondary flex-center absolute inset-0 z-10 flex h-full w-full animate-puff-in cursor-pointer flex-col items-center justify-center gap-5 rounded-xl border border-light-secondary font-indie-flower tracking-widest dark:border-dark-secondary">
            {/* Background Overlay */}
            <div className="bg-primary absolute inset-0 h-full w-full opacity-70 blur-sm saturate-150"></div>

            <span className="text-accent z-20 px-4 text-center text-4xl font-bold md:text-5xl">{isDraw ? "It's a draw!" : `${winner} wins!`}</span>

            <Icon icon={iconMap.refresh} className="z-20 size-1/6 shrink-0" />
            <span className="z-20 text-2xl">Play Again</span>
        </div>
    )
}

export default GameOverModal
