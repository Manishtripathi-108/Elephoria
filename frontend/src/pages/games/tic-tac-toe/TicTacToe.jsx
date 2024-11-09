import React from 'react'

import { Link, Outlet } from 'react-router-dom'

import { Icon } from '@iconify/react'

import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import GameOverModal from './components/GameOverModal'
import PlayerNameModal from './components/PlayerNameModal'
import ScoreBoard from './components/ScoreBoard'
import TicTacToeHeader from './components/TicTacToeHeader'

const TicTacToe = () => {
    const { state, StartOver, clearBoard } = useTicTacToeContext()
    const { mode, isDraw, isGameOver, playerX, playerO, winner, isXNext, drawScore } = state

    const openPlayerNameModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal) modal.showModal()
    }

    const renderGameStatus = () => {
        if (isGameOver) {
            return isDraw ? <span>It's a draw!</span> : <span>{winner} wins!</span>
        }
        return <>{isXNext ? `${playerX.name}'s turn (X)` : `${playerO.name}'s turn (O)`}</>
    }

    return (
        <>
            {/* Header Section */}
            <TicTacToeHeader title={mode} />

            {/* Game*/}
            <div className="container mx-auto grid place-items-center gap-5 px-2 py-5">
                <div className="text-primary flex w-full max-w-4xl items-center justify-evenly">
                    <Icon icon="game-icons:tic-tac-toe" className="size-7" />
                    <h2 className="text-accent-primary line-clamp-1 text-center font-indie-flower text-2xl font-bold tracking-wider">
                        {renderGameStatus()}
                    </h2>
                    <button title="Start New Game" className="neu-btn neu-icon-only-square-btn" onClick={StartOver}>
                        <Icon icon="game-icons:broom" className="size-7" />
                    </button>
                </div>

                {/* Game Board Placeholder */}
                <div className="relative z-0 w-fit rounded-xl border border-light-secondary p-2 shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                    <Outlet />

                    {isGameOver && <GameOverModal clearBoard={clearBoard} isDraw={isDraw} winner={winner} />}
                </div>

                <ScoreBoard playerX={playerX} playerO={playerO} drawScore={drawScore} />

                {/* Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                    <ElevateButton onClick={StartOver}>
                        <Icon icon="emojione-monotone:video-game" className="size-6" />
                        <span className="font-indie-flower text-sm font-semibold">Start Over</span>
                    </ElevateButton>
                    <ElevateButton onClick={openPlayerNameModal}>
                        <Icon icon="wpf:name" className="size-5" />
                        <span className="font-indie-flower text-sm font-semibold">
                            Change <span className="hidden md:inline">Player</span> Name
                        </span>
                    </ElevateButton>
                </div>
            </div>

            {/* Player Name Modal */}
            <PlayerNameModal />
        </>
    )
}

export default TicTacToe
