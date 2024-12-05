import React, { memo } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import cn from '../../../../utils/cn'
import { squareAnim } from '../constants'

const Square = ({ squareValue, handleClick, isActive = false, iconSize = 'size-7 md:size-12 text-xl md:text-4xl', isWinningSquare = false }) => {
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`Square ${squareValue || 'empty'}`}
            aria-pressed={!!squareValue}
            className={cn(
                'flex-center shadow-neumorphic-xs active:shadow-neumorphic-inset-xs text-secondary rounded-md p-1 font-julee transition-all md:p-2',
                iconSize,
                {
                    'text-white [--lower-shadow:#29428e] [--upper-shadow:#5990ff] focus:scale-105 dark:text-black dark:[--lower-shadow:#135ba1] dark:[--upper-shadow:#29c5ff]':
                        isActive,
                    'shadow-neumorphic-inset-xs': !!squareValue,
                    'text-accent': isWinningSquare,
                }
            )}>
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
