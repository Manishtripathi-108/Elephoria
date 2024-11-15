import React from 'react'

import { Outlet } from 'react-router-dom'

import { Icon } from '@iconify/react'

import { DialogModal } from '../../../components/common/PrimaryModal'
import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import GameOverModal from './components/GameOverModal'
import PlayOnlineForm from './components/PlayOnlineForm'
import PlayerNameModal from './components/PlayerNameModal'
import ScoreBoard from './components/ScoreBoard'
import TicTacToeHeader from './components/TicTacToeHeader'

const TicTacToe = () => {
    const { state, StartOver, clearBoard } = useTicTacToeContext()
    const { mode, isDraw, isGameOver, playerX, playerO, winner, isXNext, drawScore, isPlayingOnline, playerSymbol, roomId, roomName } = state

    const openPlayerNameModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal) modal.showModal()
    }

    const renderGameStatus = () => {
        if (isGameOver) {
            return isDraw ? <span>It's a draw!</span> : <span>{winner} wins!</span>
        }
        return <>{isXNext ? `${playerX.name}'s turn` : `${playerO.name}'s turn`}</>
    }

    const handleAction = () => {
        const modal = document.getElementById('game_action')
        if (modal) modal.showModal()
    }

    return (
        <>
            {/* Header Section */}
            <TicTacToeHeader title={isPlayingOnline ? `Welcome, to ${roomName} ${roomId} (${mode})` : mode} playingOnline={isPlayingOnline} />

            {/* Game*/}
            <div className="container mx-auto grid place-items-center gap-5 px-2 py-5">
                <div className="text-primary flex w-full max-w-4xl items-center justify-evenly">
                    <span className="text-secondary font-julee text-4xl">{isXNext ? 'X' : 'O'}</span>
                    <h2 className="text-accent line-clamp-1 text-center font-indie-flower text-2xl font-bold capitalize tracking-wider">
                        {renderGameStatus()}
                    </h2>
                    <button title="Clear Board" className="button button-icon-only-square" onClick={handleAction}>
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
                {!isPlayingOnline && (
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
                )}
            </div>

            {/* Player Name Modal */}
            {!isPlayingOnline && (
                <>
                    <PlayerNameModal />

                    <DialogModal modalId={'game_action'} maxWidthAndClasses="w-fit" closeButton={false}>
                        <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                            <Icon icon="solar:danger-triangle-bold" className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <h3 className="text-primary mb-5 font-indie-flower text-lg font-normal tracking-wider">
                                Are you sure you want to clear the board?
                            </h3>
                            <button className="button" title="No, cancel" onClick={() => document.getElementById('game_action').close()}>
                                No, cancel
                            </button>
                            <button onClick={clearBoard} title="Yes, I'm sure" className="button ml-4 mt-4 text-red-500 dark:text-red-500">
                                Yes, I'm sure
                            </button>
                        </div>
                    </DialogModal>

                    <DialogModal modalId={'play_online'} maxWidthAndClasses="w-fit">
                        <PlayOnlineForm />
                    </DialogModal>
                </>
            )}
        </>
    )
}

export default TicTacToe
