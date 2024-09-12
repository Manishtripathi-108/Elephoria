import React from 'react'
import Reset from '../../../../components/common/svg/reset'

const GameOverModal = ({ initializeGame, playerXName, playerOName, getGameStatus }) => {
    const gameStatus = getGameStatus()
    const message = gameStatus.isDraw ? "It's a draw!" : `${gameStatus.winner === 'X' ? playerXName : playerOName} wins!`

    return (
        <div
            onClick={initializeGame}
            className="text-secondary invisible absolute left-0 top-0 z-10 flex h-full w-full animate-puff-in cursor-pointer flex-col items-center justify-center gap-8 font-indie-flower">
            {/* Background Overlay */}
            <div className="bg-secondary absolute left-0 top-0 h-full w-full opacity-70 blur-sm saturate-150"></div>

            {/* Display the message */}
            <span className="text-primary z-20 text-5xl font-bold tracking-wider">{message}</span>

            {/* Play Again Button */}
            <button type="button" title="Play Again" className="text-primary flex-center z-20">
                <Reset className="size-12 animate-anti-rotate md:size-20" />
            </button>

            {/* Play Again Text */}
            <span className="z-20 text-2xl tracking-wider">Play Again</span>
        </div>
    )
}

export default GameOverModal
