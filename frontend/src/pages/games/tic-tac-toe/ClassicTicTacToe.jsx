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
        <div className="animate-zoom-in shadow-neumorphic-md relative z-0 w-fit rounded-xl border p-2">
            <div className="shadow-neumorphic-inset-sm rounded-lg border p-3">
                <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-hidden">
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
