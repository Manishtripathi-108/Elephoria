import React from 'react'

import { Outlet } from 'react-router-dom'

import { Icon } from '@iconify/react'
import { AnimatePresence } from 'motion/react'

import Loading from '../../../components/Loading'
import { ConfirmationModal, DialogModal, openModal } from '../../../components/common/PrimaryModal'
import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../context/TicTacToe/TicTacToeContext'
import { iconMap } from '../../../utils/globalConstants'
import GameOverModal from './components/GameOverModal'
import PlayOnlineForm from './components/PlayOnlineForm'
import PlayerNameModal from './components/PlayerNameModal'
import ScoreBoard from './components/ScoreBoard'
import TicTacToeHeader from './components/TicTacToeHeader'
import WaitingRoom from './components/WaitingRoom'

const TicTacToe = () => {
    const { state, startOver, startGame, leaveRoom, clearBoard } = useTicTacToeContext()
    const {
        mode,
        isDraw,
        isGameOver,
        playerX,
        playerO,
        winner,
        isXNext,
        drawScore,
        isPlayingOnline,
        isWaiting,
        playerSymbol,
        gameStarted,
        isLoading,
        roomId,
        roomName,
    } = state

    const renderGameStatus = () => {
        if (isGameOver) {
            return isDraw ? "It's a Draw!" : `${winner} Wins!`
        }
        return <>{isXNext ? `${playerX.name}'s turn` : `${playerO.name}'s turn`}</>
    }

    if (isWaiting) {
        return <WaitingRoom roomId={roomId} roomName={roomName} playerO={playerO} playerX={playerX} onStart={startGame} onExit={leaveRoom} />
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <TicTacToeHeader title={isPlayingOnline ? `Welcome, to ${roomName} ${roomId} (${mode})` : mode} playingOnline={isPlayingOnline} />

            <div className="container mx-auto grid place-items-center gap-5 px-2 py-5">
                <div className="text-primary flex w-full max-w-4xl items-center justify-evenly">
                    <span className="text-secondary font-julee text-4xl">{isXNext ? 'X' : 'O'}</span>
                    <h2 className="text-accent line-clamp-1 text-center text-2xl font-bold capitalize tracking-wider">{renderGameStatus()}</h2>
                    {isPlayingOnline ? (
                        <span className="text-highlight font-julee text-4xl">{playerSymbol}</span>
                    ) : (
                        <button onClick={() => openModal('game_action')} type="button" title="Clear Board" className="button button-icon-only-square">
                            <Icon icon={iconMap.broom} className="size-6" />
                        </button>
                    )}
                </div>

                {/* Game Board Placeholder */}
                <Outlet />

                <AnimatePresence>{isGameOver && <GameOverModal clearBoard={clearBoard} status={renderGameStatus()} />}</AnimatePresence>

                <ScoreBoard playerX={playerX} playerO={playerO} drawScore={drawScore} />

                {/* Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                    {!isPlayingOnline ? (
                        <>
                            <ElevateButton onClick={startOver}>
                                <Icon icon={iconMap.gamePad} className="size-6" />
                                <span className="text-sm font-semibold">Start Over</span>
                            </ElevateButton>
                            <ElevateButton onClick={() => openModal('playerNameModal')}>
                                <Icon icon={iconMap.player} className="size-5" />
                                <span className="text-sm font-semibold">
                                    Change <span className="hidden md:inline">Player</span> Name
                                </span>
                            </ElevateButton>
                        </>
                    ) : (
                        <ElevateButton onClick={leaveRoom} variant="danger" title="Exit Room" className="col-span-2">
                            <Icon icon={iconMap.logOut} className="size-5" />
                            <span className="text-sm font-semibold">
                                Leave <span className="hidden md:inline">Room</span>
                            </span>
                        </ElevateButton>
                    )}
                </div>
            </div>

            {/* Player Name Modal */}
            {!isPlayingOnline && (
                <>
                    <PlayerNameModal />

                    <ConfirmationModal
                        modalId={'game_action'}
                        icon={iconMap.error}
                        onConfirm={clearBoard}
                        cancelText="Cancel"
                        confirmText="Clear Board"
                        isConfirmDanger={true}>
                        Are you sure you want to clear the board?
                    </ConfirmationModal>

                    <DialogModal modalId={'play_online'} maxWidthAndClasses="w-fit">
                        <PlayOnlineForm />
                    </DialogModal>
                </>
            )}
        </>
    )
}

export default TicTacToe
