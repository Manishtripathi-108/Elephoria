import React, { useEffect } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { useTicTacToeContext } from '../../../context/TicTacToe/TicTacToeContext'
import Square from './components/Square'
import { squareAnim } from './constants'

const UltimateTicTacToe = () => {
    const { state, handleMove, setBoard } = useTicTacToeContext()
    const { classicBoard, ultimateBoard, activeIndex, winIndexes } = state

    useEffect(() => {
        setBoard('ultimate')
    }, [])

    return (
        <div
            tabIndex={0}
            className="animate-zoom-in border-light-secondary shadow-neumorphic-md dark:border-dark-secondary relative z-0 grid w-fit grid-cols-3 gap-2 rounded-xl border p-2 outline-hidden">
            {ultimateBoard.map((macroBoard, macroIndex) => (
                <div
                    key={macroIndex}
                    className={`shadow-neumorphic-inset-xs relative grid grid-cols-3 gap-2 rounded-md p-2 md:gap-3 md:p-3 ${
                        macroIndex === activeIndex ? 'bg-highlight' : ''
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
                                className="bg-primary shadow-neumorphic-inset-sm absolute inset-0 z-10 flex items-center justify-center rounded-md p-5">
                                <motion.span
                                    variants={squareAnim}
                                    className={`${winIndexes?.includes(macroIndex) ? 'text-accent' : 'text-secondary'} font-julee text-7xl select-none md:text-9xl`}>
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
