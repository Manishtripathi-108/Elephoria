import React, { memo } from 'react'

import { AnimatePresence, motion } from 'motion/react'

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

    // Motion variants
    const variants = {
        hidden: { opacity: 0, scale: 3 },
        visible: { opacity: 1, scale: 1 },
        winner: {
            opacity: [1, 1, 1],
            scale: [1, 1.3, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
            },
        },
        exit: { opacity: 0, scale: 0.5 },
    }

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
                        variants={variants}
                        className="select-none"
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
