import React, { useState } from 'react'

import NeuButton from '../../../components/common/buttons/neu-button'
import Circle from '../../../components/common/svg/circle'
import Close from '../../../components/common/svg/close'
import GamePad from '../../../components/common/svg/gamepad'
import Reset from '../../../components/common/svg/reset'
import GameOverModal from './components/game-over-modal'
import Heading from './components/heading'
import PlayerNameModal from './components/player-name-modal'

const Ultimate = () => {
    const initialBoard = Array.from({ length: 9 }, () => Array(9).fill(null))
    const [board, setBoard] = useState(initialBoard)

    const [isXNext, setIsXNext] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playerXName, setPlayerXName] = useState('Player 1')
    const [playerOName, setPlayerOName] = useState('Player 2')
    const [playerXScore, setPlayerXScore] = useState(0)
    const [playerOScore, setPlayerOScore] = useState(0)

    const renderSquare = (value, macroIndex, microIndex) => {
        return (
            <button
                type="button"
                tabIndex="10"
                key={`${macroIndex}-${microIndex}`}
                className={`flex-center text-secondary transition-all duration-300 bg-primary p-1 md:p-3 size-7 md:size-16 rounded-md ${value === null ? 'hover:bg-secondary active:shadow-neu-inset-light-xs dark:active:shadow-neu-inset-dark-xs active:bg-primary focus:bg-secondary shadow-neu-light-xs dark:shadow-neu-dark-xs' : 'shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs'}`}
                onClick={() => handleSquareClick(macroIndex, microIndex)}>
                {value === 'X' && <Close className={`svg-shadow-light-xs dark:svg-shadow-dark-xs size-full`} />}
                {value === 'O' && <Circle className={`svg-shadow-light-xs dark:svg-shadow-dark-xs size-full`} />}
            </button>
        )
    }

    const checkWinner = (board) => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]
            }
        }
        return null
    }

    const handleSquareClick = (macroIndex, microIndex) => {
        if (board[macroIndex][microIndex]) return

        // Mark the cell with the current player's mark (X or O)
        const newMicroBoards = board.map((board, i) =>
            i === macroIndex ? board.map((cell, j) => (j === microIndex ? (isXNext ? 'X' : 'O') : cell)) : board
        )
        setBoard(newMicroBoards)

        // Switch turns
        setIsXNext(!isXNext)

        const winner = checkWinner(newMicroBoards[macroIndex])
        if (winner) {
            // Update the score
            if (winner === 'X') {
                setPlayerXScore(playerXScore + 1)
            } else {
                setPlayerOScore(playerOScore + 1)
            }
        }
    }

    const initializeGame = (isNewGame = false) => {
        setBoard(initialBoard)
        setIsXNext(true)

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

    // Open or close the player names modal
    const toggleModal = (isOpen) => {
        setIsModalOpen(isOpen)
    }

    return (
        <div className="grid place-items-center">
            {/* Heading */}
            <Heading title="Ultimate Tic-Tac-Toe" />

            <div className="flex w-full flex-col flex-wrap items-center justify-around gap-5  py-5 md:flex-row md:items-start">
                {/* Game Board */}
                <div className="relative w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md rounded-lg">
                    <div className="grid grid-cols-3 gap-2">
                        {board.map((macroBoard, macroIndex) => (
                            <div
                                key={macroIndex}
                                className="relative grid grid-cols-3 md:gap-3 md:p-3 p-2 gap-2 shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs rounded-md">
                                {/* Render each micro board inside its corresponding macro board */}
                                {macroBoard.map((microBoardCell, microIndex) => renderSquare(microBoardCell, macroIndex, microIndex))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-5">
                    {/* Game Status */}
                    {/* <h2 className="text-primary grid grid-rows-2 place-items-center font-indie-flower text-2xl font-bold tracking-wider md:pt-5">
                        {getGameStatus().isGameOver
                            ? getGameStatus().isDraw
                                ? "It's a draw!"
                                : `${getGameStatus().winner === 'X' ? playerXName : playerOName} wins!`
                            : `${isXNext ? playerXName : playerOName}'s turn`}
                        <span>{!getGameStatus().isGameOver ? `${isXNext ? '(X)' : '(O)'}` : ' '}</span>
                    </h2> */}

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
                        <NeuButton type="button" title="Set Player Names" onClick={() => toggleModal(true)}>
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
                        closeModal={() => toggleModal(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Ultimate
