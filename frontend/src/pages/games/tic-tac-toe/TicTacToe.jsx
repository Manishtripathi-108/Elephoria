import React from 'react'

import { Outlet } from 'react-router-dom'

import { Icon } from '@iconify/react'
import { AnimatePresence } from 'motion/react'

import { DialogModal, DialogTrigger } from '../../../components/common/PrimaryModal'
import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import { iconMap } from '../../../utils/globalConstants'
import GameOverModal from './components/GameOverModal'
import PlayOnlineForm from './components/PlayOnlineForm'
import PlayerNameModal from './components/PlayerNameModal'
import ScoreBoard from './components/ScoreBoard'
import TicTacToeHeader from './components/TicTacToeHeader'
import WaitingRoom from './components/WaitingRoom'

const TicTacToe = () => {
    const { state, StartOver, startGame, clearBoard } = useTicTacToeContext()
    const { mode, isDraw, isGameOver, playerX, playerO, winner, isXNext, drawScore, isPlayingOnline, playerSymbol, gameStarted, roomId, roomName } =
        state

    const openPlayerNameModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal) modal.showModal()
    }

    const renderGameStatus = () => {
        if (isGameOver) {
            return isDraw ? "It's a Draw!" : `${winner} Wins!`
        }
        return <>{isXNext ? `${playerX.name}'s turn` : `${playerO.name}'s turn`}</>
    }

    return (
        <>
            {isPlayingOnline && !gameStarted ? (
                <WaitingRoom
                    roomId={roomId}
                    roomName={roomName}
                    playerO={playerO.name}
                    playerX={playerX.name}
                    onStart={startGame}
                    onExit={StartOver}
                />
            ) : (
                <>
                    <TicTacToeHeader title={isPlayingOnline ? `Welcome, to ${roomName} ${roomId} (${mode})` : mode} playingOnline={isPlayingOnline} />

                    <div className="container mx-auto grid place-items-center gap-5 px-2 py-5">
                        <div className="text-primary flex w-full max-w-4xl items-center justify-evenly">
                            <span className="text-secondary font-julee text-4xl">{isXNext ? 'X' : 'O'}</span>
                            <h2 className="text-accent line-clamp-1 text-center text-2xl font-bold capitalize tracking-wider">
                                {renderGameStatus()}
                            </h2>
                            <DialogTrigger modalId="game_action" title="Clear Board" className="button button-icon-only-square">
                                <Icon icon={iconMap.broom} className="size-6" />
                            </DialogTrigger>
                        </div>

                        {/* Game Board Placeholder */}
                        <div className="relative z-0 w-fit rounded-xl border border-light-secondary p-2 shadow-neu-light-md dark:border-dark-secondary dark:shadow-neu-dark-md">
                            <Outlet />

                            <AnimatePresence>{isGameOver && <GameOverModal clearBoard={clearBoard} status={renderGameStatus()} />}</AnimatePresence>
                        </div>

                        <ScoreBoard playerX={playerX} playerO={playerO} drawScore={drawScore} />

                        {/* Action Buttons */}
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {!isPlayingOnline ? (
                                <>
                                    <ElevateButton onClick={StartOver}>
                                        <Icon icon={iconMap.gamePad} className="size-6" />
                                        <span className="text-sm font-semibold">Start Over</span>
                                    </ElevateButton>
                                    <ElevateButton onClick={openPlayerNameModal}>
                                        <Icon icon={iconMap.player} className="size-5" />
                                        <span className="text-sm font-semibold">
                                            Change <span className="hidden md:inline">Player</span> Name
                                        </span>
                                    </ElevateButton>
                                </>
                            ) : (
                                <ElevateButton onClick={openPlayerNameModal} variant="danger" title="Exit Room" className="col-span-2">
                                    <Icon icon={iconMap.logOut} className="size-5" />
                                    <span className="text-sm font-semibold">
                                        Leave <span className="hidden md:inline">Room</span>
                                    </span>
                                </ElevateButton>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Player Name Modal */}
            {!isPlayingOnline && (
                <>
                    <PlayerNameModal />

                    <DialogModal modalId={'game_action'} maxWidthAndClasses="w-fit" closeButton={false}>
                        <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                            <Icon icon={iconMap.error} className="error mx-auto mb-4 size-12" />
                            <h3 className="text-primary mb-5 text-lg font-normal">Are you sure you want to clear the board?</h3>
                            <ElevateButton
                                onClick={() => {
                                    clearBoard()
                                    document.getElementById('game_action').close()
                                }}
                                title="Yes, I'm sure"
                                variant="danger">
                                Yes, I'm sure
                            </ElevateButton>
                            <ElevateButton title="No, cancel" className="ml-4 mt-4" onClick={() => document.getElementById('game_action').close()}>
                                No, cancel
                            </ElevateButton>
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
