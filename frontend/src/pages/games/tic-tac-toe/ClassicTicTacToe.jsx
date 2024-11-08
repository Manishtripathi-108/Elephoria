import React, { useEffect } from 'react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import Square from './components/Square'
import { WINNING_LINES } from './constants'

const ClassicTicTacToe = () => {
    const { state, updateBoard, declareDraw, declareWinner } = useTicTacToeContext()
    const { classicBoard, isGameOver, isXNext, winIndexes } = state
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
    }, [completeLoading])

    const checkBoardStatus = (board) => {
        const lines = WINNING_LINES['9']

        // Check for winner
        for (const line of lines) {
            const firstSquare = board[line[0]]
            if (firstSquare && line.every((index) => board[index] === firstSquare)) {
                return { winner: firstSquare, line }
            }
        }

        // Check for draw (if no empty cells left)
        const isBoardFull = board.every((cell) => cell !== null)
        if (isBoardFull) {
            return { winner: null, isDraw: true }
        }

        // If no winner and not a draw
        return { winner: null, isDraw: false }
    }

    const handleClick = (index) => {
        if (classicBoard[index] || isGameOver) return

        const updatedBoard = classicBoard.map((cell, i) => (i === index ? (isXNext ? 'X' : 'O') : cell))
        const result = checkBoardStatus(updatedBoard)

        if (result.winner) {
            declareWinner(result.winner, result.line)
        } else if (result?.isDraw) {
            declareDraw()
        }

        updateBoard(updatedBoard)
    }

    return (
        <div className="rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
            <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-none">
                {classicBoard.map((cell, index) => (
                    <Square
                        key={index}
                        value={cell}
                        onClick={() => handleClick(index)}
                        size="size-20 md:size-32"
                        winIndex={winIndexes?.includes(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ClassicTicTacToe
