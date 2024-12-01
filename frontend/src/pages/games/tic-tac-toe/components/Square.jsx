import React, { memo } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { squareAnim } from '../constants'

const Square = ({ squareValue, handleClick, isActive = false, iconSize = 'size-7 md:size-12 text-xl md:text-4xl', isWinningSquare = false }) => {
    const baseClasses = 'flex-center rounded-md p-1 md:p-2 transition-all duration-300 font-julee'
    const hoverEffect = isActive ? 'hover:scale-105 focus:scale-105' : ''
    const colorClasses = isWinningSquare ? 'text-accent' : isActive ? 'text-white dark:text-black' : 'text-secondary'
    const shadowClasses =
        squareValue === null
            ? isActive
                ? 'shadow-neu-light-secondary-xs dark:shadow-neu-dark-secondary-xs active:shadow-neu-inset-light-secondary-xs dark:active:shadow-neu-inset-dark-secondary-xs'
                : 'shadow-neu-light-xs dark:shadow-neu-dark-xs'
            : isActive
              ? 'shadow-neu-inset-light-secondary-xs dark:shadow-neu-inset-dark-secondary-xs'
              : 'shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs'

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`Square ${squareValue || 'empty'}`}
            aria-pressed={!!squareValue}
            className={`${baseClasses} ${hoverEffect} ${shadowClasses} ${iconSize} ${colorClasses}`}>
            <AnimatePresence>
                {squareValue && (
                    <motion.span
                        className="select-none"
                        variants={squareAnim}
                        initial="hidden"
                        animate={isWinningSquare ? 'winner' : 'visible'}
                        exit="exit">
                        {squareValue}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    )
}

export default memo(Square)
