import React, { useCallback, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import Circle from '../../../assets/svg/circle'
import Close from '../../../assets/svg/close'
import NeuButton from '../../../components/common/buttons/neu-button'
import GameOverModal from './components/game-over-modal'
import Heading from './components/heading'
import PlayerNameModal from './components/player-name-modal'

// Define winning lines for different board sizes
const WINNING_LINES = {
    9: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ],
    16: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12],
    ],
    25: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
    ],
}

export function TicTacToe() {
    // Group player-related states
    const [players, setPlayers] = useState({
        playerX: { name: 'Player 1', score: 0 },
        playerO: { name: 'Player 2', score: 0 },
    })

    // Group game-related states
    const [gameState, setGameState] = useState({
        boardSize: 9,
        board: Array(9).fill(null),
        isXNext: true,
        isGameOver: false,
        isDraw: false,
        winner: null,
    })

    const [isModalOpen, setIsModalOpen] = useState(false)

    const { boardSize, board, isXNext, isGameOver, isDraw, winner } = gameState
    const { playerX, playerO } = players

    // Focus on the game board when it is rendered
    useEffect(() => {
        const GameBoard = document.getElementById('game-board')
        if (GameBoard) {
            GameBoard.focus()
        }
    }, [boardSize])

    // Change board size and reset the board
    const changeBoardSize = useCallback((size) => {
        const newSize = parseInt(size)
        setGameState((prevState) => ({
            ...prevState,
            boardSize: newSize,
            board: Array(newSize).fill(null),
            isGameOver: false,
            isDraw: false,
            winner: null,
        }))
    }, [])

    // Check for winner
    const checkWinner = useCallback(
        (squares) => {
            const lines = WINNING_LINES[boardSize] || []

            for (const line of lines) {
                const firstSquare = squares[line[0]]
                if (firstSquare && line.every((index) => squares[index] === firstSquare)) {
                    return { winner: firstSquare, line }
                }
            }
            return null
        },
        [boardSize]
    )

    // Handle click on a square
    const handleClick = useCallback(
        (index) => {
            if (board[index] || isGameOver) return

            const updatedBoard = board.slice()
            updatedBoard[index] = isXNext ? 'X' : 'O'

            const winnerInfo = checkWinner(updatedBoard)

            if (winnerInfo) {
                const winnerName = winnerInfo.winner === 'X' ? 'playerX' : 'playerO'
                setGameState((prevState) => ({
                    ...prevState,
                    board: updatedBoard,
                    isGameOver: true,
                    winner: winnerInfo.winner,
                }))
                setPlayers((prevState) => ({
                    ...prevState,
                    [winnerName]: {
                        ...prevState[winnerName],
                        score: prevState[winnerName].score + 1,
                    },
                }))
            } else if (updatedBoard.every(Boolean)) {
                setGameState((prevState) => ({
                    ...prevState,
                    board: updatedBoard,
                    isGameOver: true,
                    isDraw: true,
                }))
            } else {
                setGameState((prevState) => ({
                    ...prevState,
                    board: updatedBoard,
                    isXNext: !isXNext,
                }))
            }
        },
        [board, isGameOver, isXNext, checkWinner]
    )

    // Render Square Component
    const renderSquare = useCallback(
        (value, index) => {
            const winnerInfo = checkWinner(board)
            const winningSquareClass = winnerInfo?.line.includes(index) ? 'text-accent-primary *:animate-pulse' : ''

            return (
                <button
                    key={index}
                    className={`flex-center text-secondary bg-primary p-3 shadow-neu-inset-light-md dark:shadow-neu-inset-dark-md ${boardSize === 9 ? 'size-28 md:size-40' : boardSize === 16 ? 'size-20 md:size-36' : 'size-16 md:size-28'} ${winningSquareClass}`}
                    onClick={() => handleClick(index)}>
                    {value === 'X' ? (
                        <Close className="svg-shadow-light-xs dark:svg-shadow-dark-xs size-full" />
                    ) : value === 'O' ? (
                        <Circle className="svg-shadow-light-xs dark:svg-shadow-dark-xs size-full" />
                    ) : null}
                </button>
            )
        },
        [board, boardSize, handleClick, checkWinner]
    )

    // Initialize or reset the game
    const initializeGame = useCallback(
        (isNewGame = false) => {
            setGameState((prevState) => ({
                ...prevState,
                board: Array(boardSize).fill(null),
                isXNext: isNewGame ? true : Math.random() < 0.5,
                isGameOver: false,
                isDraw: false,
                winner: null,
            }))
            if (isNewGame) {
                setPlayers({
                    playerX: { name: 'Player 1', score: 0 },
                    playerO: { name: 'Player 2', score: 0 },
                })
            }
        },
        [boardSize]
    )

    const toggleModal = (isOpen) => setIsModalOpen(isOpen)

    return (
        <div className="grid place-items-center">
            {/* Heading */}
            <Heading title="Classic Tic-Tac-Toe" />

            <div className="grid place-items-center gap-5 py-5">
                {/* Player Names and Reset Button */}
                <div className="text-primary flex w-full items-center justify-evenly">
                    <Icon icon="game-icons:tic-tac-toe" className="size-7" />

                    <h2 className="font-indie-flower text-2xl font-bold tracking-wider">
                        {isGameOver ? (
                            isDraw ? (
                                "It's a draw!"
                            ) : (
                                `${winner === 'X' ? playerX.name : playerO.name} wins!`
                            )
                        ) : (
                            <>
                                {`${isXNext ? playerX.name : playerO.name}'s turn`}
                                <span className="ml-3">{isXNext ? '(X)' : '(O)'}</span>
                            </>
                        )}
                    </h2>

                    <button type="button" title="Reset Game" className="neu-btn neu-icon-only-square-btn" onClick={() => initializeGame()}>
                        <Icon icon="game-icons:broom" className="size-7" />
                    </button>
                </div>

                {/* Game Board */}
                <div className="relative z-0 w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md">
                    <div
                        tabIndex={0}
                        className={`grid ${boardSize === 9 ? 'grid-cols-3' : boardSize === 16 ? 'grid-cols-4' : 'grid-cols-5'} gap-1 outline-none`}
                        id="game-board">
                        {board.map((value, index) => renderSquare(value, index))}
                    </div>

                    {/* Game Over Modal */}
                    {isGameOver && (
                        <GameOverModal
                            initializeGame={initializeGame}
                            playerXName={playerX.name}
                            playerOName={playerO.name}
                            isDraw={isDraw}
                            winner={winner}
                        />
                    )}

                    {/* Reset Game & Board Size Select */}
                    <div className="mt-3 flex items-center justify-end gap-5">
                        <div className="neu-form-group w-32">
                            <select
                                className="neu-form-select"
                                value={boardSize}
                                onChange={(e) => changeBoardSize(e.target.value)}
                                aria-label="Select board size">
                                <option value={9}>3 x 3</option>
                                <option value={16}>4 x 4</option>
                                <option value={25}>5 x 5</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Score Board */}
                <div className="text-primary grid w-10/12 grid-cols-2 place-items-center justify-between gap-10 px-4 font-indie-flower tracking-wider md:text-2xl">
                    <div className="text-nowrap rounded-lg p-3 text-center shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                        <div className="mb-3 rounded-lg p-4 font-bold shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerX.name} (X)</div>
                        <div className="rounded-lg p-1 shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerX.score}</div>
                    </div>
                    <div className="text-nowrap rounded-lg p-3 text-center shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                        <div className="mb-3 rounded-lg p-4 font-bold shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerO.name} (X)</div>
                        <div className="rounded-lg p-1 shadow-neu-light-xs dark:shadow-neu-dark-xs">{playerO.score}</div>
                    </div>
                </div>

                {/* New Game & Set Player Button */}
                <div className="grid grid-cols-2 gap-4">
                    <NeuButton type="button" title="Start New Game" onClick={() => initializeGame(true)}>
                        <Icon icon="emojione-monotone:video-game" className="size-6" />
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">New Game</span>
                    </NeuButton>
                    <NeuButton type="button" title="Set Player Names" onClick={() => toggleModal(true)}>
                        <Icon icon="wpf:name" className="size-5" />
                        <span className="font-indie-flower text-sm font-semibold tracking-wider">Set Names</span>
                    </NeuButton>
                </div>
            </div>

            {/* Player Name Modal */}
            {isModalOpen && (
                <PlayerNameModal
                    setPlayerName={(player, name) =>
                        setPlayers((prevState) => ({
                            ...prevState,
                            [player]: { ...prevState[player], name },
                        }))
                    }
                    playerXName={playerX.name}
                    playerOName={playerO.name}
                    closeModal={() => toggleModal(false)}
                />
            )}
        </div>
    )
}

export default TicTacToe
