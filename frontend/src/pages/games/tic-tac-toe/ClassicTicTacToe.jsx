import React, { useEffect } from 'react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import Square from './components/Square'

const ClassicTicTacToe = () => {
    const { state, setMode, handleMove } = useTicTacToeContext()
    const { classicBoard, winIndexes } = state
    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
        setMode('classic')
    }, [])

    return (
        <div className="rounded-lg border border-light-secondary p-3 shadow-neu-inset-light-sm dark:border-dark-secondary dark:shadow-neu-inset-dark-sm">
            <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-none">
                {classicBoard.map((cell, index) => (
                    <Square
                        key={index}
                        squareValue={cell}
                        handleClick={() => handleMove(index)}
                        iconSize="size-20 md:size-32 text-6xl md:text-8xl"
                        isWinningSquare={winIndexes?.includes(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ClassicTicTacToe
