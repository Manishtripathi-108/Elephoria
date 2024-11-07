import React, { useEffect, useState } from 'react'

import { Link, Outlet } from 'react-router-dom'

import ElevateButton from '../../../components/common/buttons/ElevateButton'
import { useLoadingBar } from '../../../context/LoadingBarContext'
import PlayerNameModal from './components/PlayerNameModal'

const TicTacToe = () => {
    const [players, setPlayers] = useState({
        playerX: { name: 'Player 1', score: 0 },
        playerO: { name: 'Player 2', score: 0 },
    })

    const title = 'Tic Tac Toe'

    const { playerX, playerO } = players

    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
    }, [completeLoading])

    const openPlayerNameModal = () => {
        const modal = document.getElementById('playerNameModal')
        if (modal) {
            modal.showModal()
        }
    }

    return (
        <>
            <div className="mb-2 mt-16 grid w-full grid-cols-2 border-b border-light-secondary py-3 dark:border-dark-secondary">
                <div className="text-primary flex-center font-indie-flower text-lg font-bold tracking-wider md:text-2xl">{title}</div>
                <div className="flex-center gap-3">
                    <Link to="/games/tic-tac-toe" aria-disabled>
                        <ElevateButton type="button">
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">Classic</span>
                        </ElevateButton>
                    </Link>
                    <Link to="/games/tic-tac-toe/ultimate">
                        <ElevateButton type="button">
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">Ultimate</span>
                        </ElevateButton>
                    </Link>
                    <ElevateButton type="button" onClick={openPlayerNameModal}>
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Ultimate</span>
                    </ElevateButton>
                </div>
            </div>

            <Outlet />

            <PlayerNameModal
                playerOName={playerO.name}
                playerXName={playerX.name}
                updatePlayerName={(player, name) =>
                    setPlayers((prevState) => ({
                        ...prevState,
                        [player]: { ...prevState[player], name },
                    }))
                }
            />
        </>
    )
}

export default TicTacToe
