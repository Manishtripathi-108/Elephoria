import React, { useEffect } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { useLoadingBar } from '../../../context/LoadingBarContext'
import { useTicTacToeContext } from '../../../context/TicTacToe/TicTacToeContext'
import Square from './components/Square'
import { squareAnim } from './constants'

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
                    <AnimatePresence>
                        {classicBoard[macroIndex] && (
                            <motion.div
                                initial="hidden"
                                animate={winIndexes?.includes(macroIndex) ? 'winner' : 'visible'}
                                exit="exit"
                                variants={{
                                    hidden: { scale: 0 },
                                    visible: {
                                        scale: 1,
                                        transition: { when: 'beforeChildren', staggerChildren: 0.5 },
                                    },
                                    winner: { scale: 1 },
                                    exit: { scale: 0 },
                                }}
                                className="flex-center bg-primary absolute inset-0 z-10 rounded-md p-5 shadow-neu-inset-light-sm dark:shadow-neu-inset-dark-sm">
                                <motion.span
                                    variants={squareAnim}
                                    className={`${winIndexes?.includes(macroIndex) ? 'text-accent' : 'text-secondary'} select-none font-julee text-7xl md:text-9xl`}>
                                    {classicBoard[macroIndex]}
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

export default UltimateTicTacToe
