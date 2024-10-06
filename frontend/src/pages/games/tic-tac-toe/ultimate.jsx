import React, { useCallback, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'

import Circle from '../../../assets/svg/circle'
import Close from '../../../assets/svg/close'
import NeuButton from '../../../components/common/buttons/neu-button'
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

    useEffect(() => {
        const GameBoard = document.getElementById('game-board')
        if (GameBoard) {
            GameBoard.focus()
        }
    }, [])

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
                key={`${macroIndex}-${microIndex}`}
                className={`flex-center bg-primary size-7 rounded-md p-1 transition-all duration-300 md:size-12 md:p-2 ${squareClasses}`}
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
            } else if (largeBoard[microIndex]) {
                // If the large board is already won, and next index is won, reset the activeMacroIndex
                updateGameState({ activeMacroIndex: null })
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
                <div className="relative w-fit rounded-lg p-2 shadow-neu-light-md dark:shadow-neu-dark-md">
                    <div id="game-board" tabIndex={0} className="grid grid-cols-3 gap-2 outline-none">
                        {miniBoard.map((macroBoard, macroIndex) => (
                            <div
                                key={macroIndex}
                                className={`${macroIndex === activeMacroIndex && 'bg-highlight-primary *:bg-highlight-primary'} relative grid grid-cols-3 gap-2 rounded-md p-2 shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs md:gap-3 md:p-3`}>
                                {macroBoard.map((cell, microIndex) => renderSquare(cell, macroIndex, microIndex))}

                                {largeBoard[macroIndex] && (
                                    <div className="flex-center invisible absolute inset-0 z-10 animate-puff-in">
                                        <div className="bg-secondary absolute inset-0 opacity-70 blur-sm saturate-150"></div>
                                        <span
                                            className={`text-primary z-20 text-center font-indie-flower text-5xl font-bold tracking-wider ${
                                                winingLine.includes(macroIndex)
                                                    ? 'text-light-text-primary *:animate-pulse dark:text-dark-text-primary'
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
