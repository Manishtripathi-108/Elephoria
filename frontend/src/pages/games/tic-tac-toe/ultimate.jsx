import React, { useCallback, useEffect, useState } from 'react'

import NeuButton from '../../../components/common/buttons/neu-button'
import Circle from '../../../components/common/svg/circle'
import Close from '../../../components/common/svg/close'
import GamePad from '../../../components/common/svg/gamepad'
import Reset from '../../../components/common/svg/reset'
import GameOverModal from './components/game-over-modal'
import Heading from './components/heading'
import PlayerNameModal from './components/player-name-modal'

const Ultimate = () => {
    const initialMiniBoard = Array(9).fill(Array(9).fill(null))
    const initialLargeBoard = Array(9).fill(null)

    // Group player-related states
    const [players, setPlayers] = useState({
        playerX: { name: 'Player 1', score: 0 },
        playerO: { name: 'Player 2', score: 0 },
    })

    // Group game-related states
    const [gameState, setGameState] = useState({
        miniBoard: initialMiniBoard,
        largeBoard: initialLargeBoard,
        isXNext: true,
        isGameOver: false,
        isDraw: false,
        activeMacroIndex: null,
        winner: null,
        winingLine: [],
    })

    const { miniBoard, largeBoard, isXNext, isGameOver, isDraw, activeMacroIndex, winner, winingLine } = gameState
    const { playerX, playerO } = players

    const [isModalOpen, setIsModalOpen] = useState(false)

    const WIN_PATTERN = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    // Render Square Component
    const renderSquare = (value, macroIndex, microIndex) => {
        const squareClasses =
            value === null
                ? macroIndex === activeMacroIndex
                    ? 'hover:bg-secondary active:shadow-neu-inset-light-secondary-xs dark:active:shadow-neu-inset-dark-secondary-xs active:bg-highlight-primary shadow-neu-light-secondary-xs dark:shadow-neu-dark-secondary-xs'
                    : 'shadow-neu-light-xs dark:shadow-neu-dark-xs'
                : macroIndex === activeMacroIndex
                  ? 'shadow-neu-inset-light-secondary-xs dark:shadow-neu-inset-dark-secondary-xs text-white dark:text-black'
                  : 'shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs text-secondary'

        return (
            <button
                tabIndex="10"
                key={`${macroIndex}-${microIndex}`}
                className={`flex-center bg-primary p-1 md:p-2 size-7 md:size-12 rounded-md transition-all duration-300 ${squareClasses}`}
                onClick={() => handleSquareClick(macroIndex, microIndex)}>
                {value === 'X' ? <Close className="size-full" /> : value === 'O' ? <Circle className="size-full" /> : null}
            </button>
        )
    }

    // Check if there is a winner
    const checkWinner = useCallback((currentBoard, isLargeBoard = false) => {
        for (let [a, b, c] of WIN_PATTERN) {
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                if (isLargeBoard)
                    setGameState((prevState) => ({
                        ...prevState,
                        winner: currentBoard[a],
                        isGameOver: true,
                        winingLine: [a, b, c],
                    }))
                return currentBoard[a]
            }
        }
        return null
    }, [])

    const handleSquareClick = useCallback(
        (macroIndex, microIndex) => {
            // Early exit if the game is over, the square is filled, or the board is inactive/won
            if (
                isGameOver ||
                miniBoard[macroIndex][microIndex] ||
                (activeMacroIndex !== null && activeMacroIndex !== macroIndex) ||
                largeBoard[macroIndex]
            ) {
                return
            }

            // Update the mini board with the new move
            const updatedBoard = miniBoard.map((macroBoard, i) =>
                i === macroIndex ? macroBoard.map((cell, j) => (j === microIndex ? (isXNext ? 'X' : 'O') : cell)) : macroBoard
            )

            // Memoize results for better readability and optimization
            const miniBoardWinner = checkWinner(updatedBoard[macroIndex])
            const isMiniBoardFull = updatedBoard[macroIndex].every((cell) => cell)
            const isLargeBoardFull = updatedBoard.every((macroBoard) => macroBoard.every((cell) => cell))

            // Helper to update game state with overrides
            const updateGameState = (overrides = {}) =>
                setGameState((prevState) => ({
                    ...prevState,
                    miniBoard: updatedBoard,
                    isXNext: !isXNext,
                    activeMacroIndex: microIndex,
                    ...overrides,
                }))

            let updatedLargeBoard = largeBoard

            // Handle mini-board winner
            if (miniBoardWinner) {
                updatedLargeBoard = largeBoard.map((cell, i) => (i === macroIndex ? miniBoardWinner : cell))
                updateGameState({ largeBoard: updatedLargeBoard })

                // If the large board is already won, and next index is won, reset the activeMacroIndex
                if (updatedLargeBoard[microIndex]) {
                    updateGameState({ activeMacroIndex: null })
                }

                const largeBoardWinner = checkWinner(updatedLargeBoard, true)

                // Handle the large board win or draw
                if (largeBoardWinner) {
                    updateGameState({
                        isGameOver: true,
                        isDraw: largeBoardWinner === 'D',
                        winner: largeBoardWinner !== 'D' ? largeBoardWinner : null,
                    })

                    if (largeBoardWinner !== 'D') {
                        const winnerName = largeBoardWinner === 'X' ? 'playerX' : 'playerO'
                        setPlayers((prevState) => ({
                            ...prevState,
                            [winnerName]: {
                                ...prevState[winnerName],
                                score: prevState[winnerName].score + 1,
                            },
                        }))
                    }
                    return
                }
            } else if (isLargeBoardFull) {
                // Handle overall game draw
                updateGameState({ isGameOver: true, isDraw: true })
                return
            } else if (isMiniBoardFull) {
                // Handle mini-board draw
                updatedLargeBoard = largeBoard.map((cell, i) => (i === macroIndex ? 'D' : cell))
                updateGameState({ largeBoard: updatedLargeBoard })
            } else {
                // Normal case: update game state with just the move
                updateGameState()
            }
        },
        [miniBoard, largeBoard, isXNext, isGameOver, checkWinner, activeMacroIndex]
    )

    // Initialize Game
    const initializeGame = (isNewGame = false) => {
        setGameState({
            miniBoard: initialMiniBoard,
            largeBoard: initialLargeBoard,
            isXNext: isNewGame ? true : Math.random() < 0.5,
            isGameOver: false,
            isDraw: false,
            winner: null,
            activeMacroIndex: null,
            winingLine: [],
        })

        if (isNewGame) {
            setPlayers({
                playerX: { name: 'Player 1', score: 0 },
                playerO: { name: 'Player 2', score: 0 },
            })
        }
    }

    const toggleModal = (isOpen) => setIsModalOpen(isOpen)

    return (
        <div className="grid place-items-center">
            <Heading title="Ultimate Tic-Tac-Toe" />

            <div className="flex w-full flex-col flex-wrap items-center justify-around gap-5 py-5 md:flex-row md:items-start">
                <div className="relative w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md rounded-lg">
                    <div className="grid grid-cols-3 gap-2">
                        {miniBoard.map((macroBoard, macroIndex) => (
                            <div
                                key={macroIndex}
                                className={`${macroIndex === activeMacroIndex && 'bg-highlight-primary *:bg-highlight-primary'} relative grid grid-cols-3 md:gap-3 md:p-3 p-2 gap-2 shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs rounded-md`}>
                                {macroBoard.map((cell, microIndex) => renderSquare(cell, macroIndex, microIndex))}

                                {largeBoard[macroIndex] && (
                                    <div className="absolute inset-0 z-10 flex-center invisible animate-puff-in">
                                        <div className="bg-secondary opacity-70 blur-sm saturate-150 absolute inset-0"></div>
                                        <span
                                            className={`text-primary z-20 text-5xl font-bold tracking-wider font-indie-flower text-center ${
                                                winingLine.includes(macroIndex)
                                                    ? 'text-light-text-primary dark:text-dark-text-primary *:animate-pulse'
                                                    : ''
                                            }`}>
                                            {largeBoard[macroIndex] === 'X' ? (
                                                <Close className="size-full" />
                                            ) : largeBoard[macroIndex] === 'O' ? (
                                                <Circle className="size-full" />
                                            ) : (
                                                'Draw'
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
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
                </div>

                {/* Game Status */}
                <div className="flex flex-col items-center justify-center gap-5">
                    <h2 className="text-primary grid place-items-center font-indie-flower text-2xl font-bold tracking-wider md:pt-5">
                        {isGameOver
                            ? isDraw
                                ? "It's a draw!"
                                : `${winner === 'X' ? playerX.name : playerO.name} wins!`
                            : `${isXNext ? playerX.name : playerO.name}'s turn`}
                        <span>{!isGameOver && `${isXNext ? '(X)' : '(O)'}`}</span>
                    </h2>

                    {/* Score miniBoard */}
                    <div className="text-secondary grid w-10/12 grid-cols-2 place-items-center justify-between gap-10 px-4 font-indie-flower tracking-wider">
                        <div className="grid place-items-center">
                            {playerX.name} <div>(X)</div>
                            <div>{playerX.score}</div>
                        </div>
                        <div className="grid place-items-center">
                            {playerO.name} <div>(O)</div>
                            <div>{playerO.score}</div>
                        </div>
                    </div>

                    {/* New Game & Set Player Button */}
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" title="Reset Game" className="text-primary col-span-2 flex-center" onClick={() => initializeGame()}>
                            <Reset className="size-8" strokeWidth={2} />
                        </button>
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
        </div>
    )
}

export default Ultimate
