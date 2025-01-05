import React, { useEffect } from 'react'

import { useTicTacToeContext } from '../../../context/TicTacToe/TicTacToeContext'
import Square from './components/Square'

const ClassicTicTacToe = () => {
    const { state, setBoard, handleMove } = useTicTacToeContext()
    const { classicBoard, winIndexes } = state

    useEffect(() => {
        setBoard('classic')
    }, [])

    return (
        <div className="relative z-0 w-fit animate-zoom-in rounded-xl border border-light-secondary p-2 shadow-neumorphic-md dark:border-dark-secondary">
            <div className="rounded-lg border border-light-secondary p-3 shadow-neumorphic-inset-sm dark:border-dark-secondary">
                <div tabIndex={0} className="outline-hidden grid grid-cols-3 gap-3">
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
        </div>
    )
}

export default ClassicTicTacToe
