import React from 'react'

import { Link, Outlet } from 'react-router-dom'

import { Icon } from '@iconify/react'

import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import GameOverModal from './components/GameOverModal'
import PlayerNameModal from './components/PlayerNameModal'

const TicTacToe = () => {
    const { state, StartOver, clearBoard } = useTicTacToeContext()
    const { isDraw, isGameOver, playerX, playerO, winner, isXNext } = state

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
        <div className="container mx-auto py-5">
            {/* Header Section */}
            <div className="mt-16 grid grid-cols-2 border-b border-light-secondary py-3 dark:border-dark-secondary">
                <h1 className="text-primary flex-center font-indie-flower text-lg font-bold tracking-wider md:text-2xl">Tic Tac Toe</h1>
                <div className="flex-center gap-3">
                    <Link to="/games/tic-tac-toe/classic" aria-disabled>
                        <ElevateButton>
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">Classic</span>
                        </ElevateButton>
                    </Link>
                    <Link to="/games/tic-tac-toe/ultimate">
                        <ElevateButton>
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">Ultimate</span>
                        </ElevateButton>
                    </Link>
                </div>
            </div>

            {/* Game Status Section */}
            <div className="mx-2 grid place-items-center gap-5 py-5">
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

                {/* Score Board */}
                <div className="flex w-full flex-wrap items-center justify-center gap-5 px-4 font-indie-flower tracking-wider">
                    <div className="text-highlight-primary order-1 w-36 rounded-lg p-4 text-center shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm sm:w-60">
                        <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neu-light-xs dark:shadow-neu-dark-xs">
                            <span className="line-clamp-1">{playerX.name}</span> (X)
                        </h3>
                        <div className="text-primary rounded-lg text-2xl shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerX.score}</div>
                    </div>
                    <div className="text-highlight-primary order-3 w-36 rounded-lg p-4 text-center shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm sm:order-2 sm:w-60">
                        <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neu-light-xs dark:shadow-neu-dark-xs">Draws</h3>
                        <div className="text-primary rounded-lg text-2xl shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerO.score}</div>
                    </div>
                    <div className="text-highlight-primary order-2 w-36 rounded-lg p-4 text-center shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm sm:order-3 sm:w-60">
                        <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neu-light-xs dark:shadow-neu-dark-xs">
                            <span className="line-clamp-1">{playerO.name}</span> (O)
                        </h3>
                        <div className="text-primary rounded-lg text-2xl shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerO.score}</div>
                    </div>
                </div>

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
        </div>
    )
}

export default TicTacToe
