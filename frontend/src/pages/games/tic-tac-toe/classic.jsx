import React, { useState, useEffect } from 'react'

import NeuButton from '../../../components/common/buttons/neu-button'
import PlayerNameModal from './components/player-name-modal'
import GameOverModal from './components/game-over-modal'

import Close from '../../../components/common/svg/close'
import Circle from '../../../components/common/svg/circle'
import Reset from '../../../components/common/svg/reset'
import GamePad from '../../../components/common/svg/gamepad'
import Heading from './components/heading'

export function TicTacToe() {
    // State to track the size of the board
    const [boardSize, setBoardSize] = useState(9)
    const [board, setBoard] = useState(Array(boardSize).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playerXName, setPlayerXName] = useState('Player 1')
    const [playerOName, setPlayerOName] = useState('Player 2')
    const [playerXScore, setPlayerXScore] = useState(0)
    const [playerOScore, setPlayerOScore] = useState(0)

    // Change board size based on the selected value
    const changeBoardSize = (size) => {
        setBoardSize(parseInt(size))
        setBoard(Array(parseInt(parseInt(size))).fill(null))
    }

    // Check for winner returns the winner and the winning line
    const checkWinner = (squares) => {
        const lines_3 = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        const lines_4 = [
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
        ]

        const lines_5 = [
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
        ]

        const lines = boardSize === 9 ? lines_3 : boardSize === 16 ? lines_4 : boardSize === 25 ? lines_5 : []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const firstSquare = squares[line[0]]

            if (firstSquare && line.every((index) => squares[index] === firstSquare)) {
                return { winner: firstSquare, line }
            }
        }

        return null
    }

    const handleClick = (index) => {
        if (board[index] || checkWinner(board)) return

        const newBoard = board.slice()
        newBoard[index] = isXNext ? 'X' : 'O'
        setBoard(newBoard)
        setIsXNext(!isXNext)

        const winnerInfo = checkWinner(newBoard)
        if (winnerInfo) {
            updateScore(winnerInfo.winner)
        }
    }

    const updateScore = (winner) => {
        if (winner === 'X') {
            setPlayerXScore((prevScore) => prevScore + 1)
        } else if (winner === 'O') {
            setPlayerOScore((prevScore) => prevScore + 1)
        }
    }

    // Render Square Component with X or O value based on the board state and handle click event to update the board state on click event on the square component and check for winner
    const renderSquare = (value, index) => {
        const winnerInfo = checkWinner(board)
        const winningLine = winnerInfo ? winnerInfo.line : []
        const isWinningSquare = winningLine.includes(index)

        return (
            <button
                type="button"
                tabIndex="10"
                key={index}
                className={`flex-center text-secondary bg-primary p-3 shadow-neu-inset-light-md dark:shadow-neu-inset-dark-md ${boardSize === 9 ? 'size-28 md:size-40' : boardSize === 16 ? 'size-20 md:size-36' : boardSize === 25 ? 'size-16 md:size-28' : ''}`}
                onClick={() => handleClick(index)}>
                {value === 'X' && (
                    <Close
                        className={`svg-shadow-light-xs dark:svg-shadow-dark-xs ${
                            isWinningSquare ? 'text-accent-primary animate-pulse' : ''
                        } size-full`}
                    />
                )}
                {value === 'O' && (
                    <Circle
                        className={`svg-shadow-light-xs dark:svg-shadow-dark-xs ${
                            isWinningSquare ? 'text-accent-primary animate-pulse' : ''
                        } size-full`}
                    />
                )}
            </button>
        )
    }

    // Get the game status based on the board state and check for winner or isDraw or isGameOver
    const getGameStatus = () => {
        const winner = checkWinner(board) ? checkWinner(board).winner : null
        const isBoardFull = board.every((square) => square)

        if (winner) {
            return { isGameOver: true, isDraw: false, winner }
        }

        if (isBoardFull) {
            return { isGameOver: true, isDraw: true, winner: null }
        }

        return { isGameOver: false, isDraw: false, winner: null }
    }

    // Initialize the game with initial board state or restart the game with the new players
    const initializeGame = (isNewGame = false) => {
        setBoard(Array(boardSize).fill(null))

        if (isNewGame) {
            setIsXNext(true)
            setPlayerXScore(0)
            setPlayerOScore(0)
            setPlayerXName('Player 1')
            setPlayerOName('Player 2')
        } else {
            setIsXNext(Math.random() < 0.5)
        }
    }

    // Open modal to set player names
    const handleSetNamesClick = () => {
        setIsModalOpen(true)
    }

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false)
    }

    // Close modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            const playerModal = document.getElementById('player-form-modal')
            if (playerModal && !playerModal.contains(event.target)) {
                closeModal()
            }
        }

        // Focus on the first input field when modal is open
        if (isModalOpen) {
            const player1Input = document.getElementById('player1')
            if (player1Input) {
                player1Input.focus()
            }
        }

        // Add event listener when modal is open
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        // Clean up event listener on component unmount or when modal closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isModalOpen])

    return (
        <div className="grid place-items-center">
            {/* Heading */}
            <Heading title="Classic Tic-Tac-Toe" />

            <div className="flex w-full flex-col flex-wrap items-center justify-around gap-5 py-5 md:flex-row md:items-start">
                {/* Game Board */}
                <div className="relative w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md">
                    <div
                        className={`grid ${
                            boardSize
                                ? boardSize === 9
                                    ? 'grid-cols-3'
                                    : boardSize === 16
                                      ? 'grid-cols-4'
                                      : boardSize === 25
                                        ? 'grid-cols-5'
                                        : boardSize === 36
                                          ? 'grid-cols-6'
                                          : ''
                                : ''
                        } gap-1`}
                        id="game-board">
                        {board.map((value, index) => renderSquare(value, index))}
                    </div>

                    {/* Game Over Modal */}
                    {getGameStatus().isGameOver && (
                        <GameOverModal
                            initializeGame={initializeGame}
                            playerXName={playerXName}
                            playerOName={playerOName}
                            getGameStatus={getGameStatus}
                        />
                    )}

                    {/* Reset Game & Board Size Select */}
                    <div className="mt-3 flex items-center justify-end gap-5">
                        <button type="button" title="Reset Game" className="text-primary flex-center" onClick={() => initializeGame()}>
                            <Reset className="size-8" strokeWidth={2} />
                        </button>
                        <div className="neu-form-group w-32">
                            <select
                                className="neu-form-select"
                                name="board-size"
                                id="board-size"
                                value={boardSize}
                                onChange={(e) => {
                                    changeBoardSize(e.target.value)
                                }}>
                                <option value="9">3 x 3</option>
                                <option value="16">4 x 4</option>
                                <option value="25">5 x 5</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-5">
                    {/* Game Status */}
                    <h2 className="text-primary grid grid-rows-2 place-items-center font-indie-flower text-2xl font-bold tracking-wider md:pt-5">
                        {getGameStatus().isGameOver
                            ? getGameStatus().isDraw
                                ? "It's a draw!"
                                : `${getGameStatus().winner === 'X' ? playerXName : playerOName} wins!`
                            : `${isXNext ? playerXName : playerOName}'s turn`}
                        <span>{!getGameStatus().isGameOver ? `${isXNext ? '(X)' : '(O)'}` : ' '}</span>
                    </h2>

                    {/* Score Board */}
                    <div className="text-secondary grid w-10/12 grid-cols-2 place-items-center justify-between gap-10 px-4 font-indie-flower tracking-wider">
                        <div className="grid grid-rows-3 place-items-center">
                            {playerXName} <div>(X)</div>
                            <div>{playerXScore}</div>
                        </div>
                        <div className="grid grid-rows-3 place-items-center">
                            {playerOName} <div>(O)</div>
                            <div>{playerOScore}</div>
                        </div>
                    </div>

                    {/* New Game & Set Player Button */}
                    <div className="grid grid-cols-2 gap-4">
                        <NeuButton type="button" title="Start New Game" onClick={() => initializeGame(true)}>
                            <GamePad className="size-6" />
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">New Game</span>
                        </NeuButton>
                        <NeuButton type="button" title="Set Player Names" onClick={handleSetNamesClick}>
                            <GamePad className="size-6" />
                            <span className="font-indie-flower text-sm font-semibold tracking-wider">Set Names</span>
                        </NeuButton>
                    </div>
                </div>

                {/* Player Names Form Modal */}
                {isModalOpen && (
                    <PlayerNameModal
                        playerOName={playerOName}
                        playerXName={playerXName}
                        setPlayerOName={setPlayerOName}
                        setPlayerXName={setPlayerXName}
                        closeModal={closeModal}
                    />
                )}
            </div>
        </div>
    )
}

export default TicTacToe
