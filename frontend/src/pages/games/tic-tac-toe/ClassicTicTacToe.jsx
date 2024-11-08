import React, { useEffect } from 'react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import Square from './components/Square'
import { evaluateBoardStatus } from './constants'

const ClassicTicTacToe = () => {
    const { state, setMode, updateBoard, declareDraw, declareWinner } = useTicTacToeContext()
    const { classicBoard, isGameOver, isXNext, winIndexes } = state
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
        setMode('classic')
    }, [])

    const handleMove = (index) => {
        if (classicBoard[index] || isGameOver) return

        const updatedBoard = classicBoard.map((cell, i) => (i === index ? (isXNext ? 'X' : 'O') : cell))
        const result = evaluateBoardStatus(updatedBoard)

        if (result.status === 'win') {
            declareWinner(result.winner, result.line)
        } else if (result.status === 'draw') {
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
                        squareValue={cell}
                        handleClick={() => handleMove(index)}
                        iconSize="size-20 md:size-32"
                        isWinningSquare={winIndexes?.includes(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ClassicTicTacToe
