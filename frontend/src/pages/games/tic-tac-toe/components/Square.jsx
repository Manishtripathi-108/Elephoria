import React, { memo } from 'react'

import { Icon } from '@iconify/react'

import { ICONS } from '../constants'

const Square = ({ squareValue, handleClick, isActive = false, iconSize = 'size-7 md:size-12', isWinningSquare = false }) => {
    const baseClasses = 'flex-center rounded-md p-1 md:p-2 transition-all duration-300'
    const hoverEffect = isActive ? 'hover:scale-105 focus:scale-105' : ''
    const colorClasses = isWinningSquare ? 'text-accent-primary' : isActive ? 'text-white dark:text-black' : 'text-secondary'
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
            {squareValue && (
                <Icon icon={ICONS[squareValue]} className={`size-full ${isWinningSquare ? 'animate-pulse-slow' : ''}`} aria-hidden="true" />
            )}
        </button>
    )
}

export default memo(Square)
