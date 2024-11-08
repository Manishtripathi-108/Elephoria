import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import Square from './components/Square'

const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const ICONS = {
    X: 'line-md:close',
    O: 'line-md:circle',
    D: 'game-icons:crossed-swords',
}

const UltimateTicTacToe = () => {
    const { state, updateBoard, declareDraw, declareWinner, updateClassicBoard, setActiveIndex } = useTicTacToeContext()
    const { classicBoard, ultimateBoard, isGameOver, isXNext, activeIndex, winIndexes } = state

    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
    }, [completeLoading])

    // Function to check for a winner or draw
    const evaluateBoardStatus = (board) => {
        for (const [a, b, c] of WINNING_PATTERNS) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { status: 'win', winner: board[a], line: [a, b, c] }
            }
        }
        const isBoardFull = board.every((cell) => cell)
        if (isBoardFull) return { status: 'draw' }
        return { status: 'continue' }
    }

    const handleMove = (macroIndex, cellIndex) => {
        if (isGameOver || ultimateBoard[macroIndex][cellIndex] || (activeIndex !== null && activeIndex !== macroIndex) || classicBoard[macroIndex]) {
            return
        }

        // Update the small board with current player's move
        const updatedUltimateBoard = ultimateBoard.map((macroBoard, i) =>
            i === macroIndex ? macroBoard.map((cell, j) => (j === cellIndex ? (isXNext ? 'X' : 'O') : cell)) : macroBoard
        )

        // Evaluate mini board status
        const miniBoardStatus = evaluateBoardStatus(updatedUltimateBoard[macroIndex])
        let updatedClassicBoard = [...classicBoard]

        if (miniBoardStatus.status === 'win') {
            updatedClassicBoard[macroIndex] = miniBoardStatus.winner
        } else if (miniBoardStatus.status === 'draw') {
            updatedClassicBoard[macroIndex] = 'D'
        }

        // Check if the large board has a winner or draw
        const largeBoardStatus = evaluateBoardStatus(updatedClassicBoard)

        // Update the context state based on board evaluation
        updateBoard(updatedUltimateBoard)
        updateClassicBoard(updatedClassicBoard)

        if (largeBoardStatus.status === 'win' && largeBoardStatus.winner !== 'D') {
            declareWinner(largeBoardStatus.winner, largeBoardStatus.line)
        } else if (largeBoardStatus.status === 'draw') {
            declareDraw()
        } else {
            // Set active board based on the player's move
            setActiveIndex(updatedClassicBoard[cellIndex] ? null : cellIndex)
        }
    }

    return (
        <div id="game-board" tabIndex={0} className="grid grid-cols-3 gap-2 outline-none">
            {ultimateBoard.map((macroBoard, macroIndex) => (
                <div
                    key={macroIndex}
                    className={`relative grid grid-cols-3 gap-2 rounded-md p-2 shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs md:gap-3 md:p-3 ${
                        macroIndex === activeIndex ? 'bg-highlight-primary' : ''
                    }`}>
                    {macroBoard.map((cell, cellIndex) => (
                        <Square
                            key={`${macroIndex}-${cellIndex}`}
                            value={cell}
                            onClick={() => handleMove(macroIndex, cellIndex)}
                            activeBg={macroIndex === activeIndex}
                        />
                    ))}
                    {classicBoard[macroIndex] && (
                        <div className="flex-center bg-primary absolute inset-0 z-10 animate-puff-in rounded-md p-5 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                            <Icon
                                icon={ICONS[classicBoard[macroIndex]]}
                                className={`size-full ${
                                    winIndexes?.includes(macroIndex) ? 'animate-pulse-slow text-accent-primary' : 'text-secondary'
                                }`}
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default UltimateTicTacToe
