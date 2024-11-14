import React, { useEffect } from 'react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import Square from './components/Square'

const ClassicTicTacToe = () => {
    const { state, setMode, handleMove, handleOnlineMove } = useTicTacToeContext()
    const { classicBoard, winIndexes, isPlayingOnline } = state
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
        setMode('classic')
    }, [])

    const handleSquareClick = (index) => {
        if (classicBoard[index] || isGameOver) return
        handleMove(index)

        const moveData = {
            index,
            symbol: isXNext ? 'X' : 'O',
        }
        if (isPlayingOnline) handleOnlineMove(moveData)
    }

    return (
        <div className="rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
            <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-none">
                {classicBoard.map((cell, index) => (
                    <Square
                        key={index}
                        squareValue={cell}
                        handleClick={() => handleSquareClick(index)}
                        iconSize="size-20 md:size-32 text-6xl md:text-8xl"
                        isWinningSquare={winIndexes?.includes(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ClassicTicTacToe
