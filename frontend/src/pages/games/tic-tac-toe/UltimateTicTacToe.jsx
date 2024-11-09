import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToeContext'
import { ICONS } from '../../../utils/TicTacToeConst'
import Square from './components/Square'

const UltimateTicTacToe = () => {
    const { state, setMode, handleMove } = useTicTacToeContext()
    const { classicBoard, ultimateBoard, activeIndex, winIndexes } = state

    const { completeLoading } = useLoadingBar()

    useEffect(() => {
        completeLoading()
        setMode('ultimate')
    }, [])

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
                            squareValue={cell}
                            handleClick={() => handleMove(macroIndex, cellIndex)}
                            isActive={macroIndex === activeIndex}
                        />
                    ))}
                    {classicBoard[macroIndex] && (
                        <div className="flex-center bg-primary absolute inset-0 z-10 animate-puff-in rounded-md p-5 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                            <Icon
                                icon={ICONS[classicBoard[macroIndex]]}
                                className={`size-full ${
                                    winIndexes?.includes(macroIndex) ? 'text-accent-primary animate-pulse-slow' : 'text-secondary'
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
