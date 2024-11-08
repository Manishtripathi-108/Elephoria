import React, { memo } from 'react'

import { Icon } from '@iconify/react'

const Square = ({ value, onClick, activeBg = false, size = 'size-7 md:size-12', winIndex = false }) => {
    const baseClasses = 'flex-center rounded-md p-1 md:p-2 transition-all duration-300'
    const hoverClasses = activeBg ? 'hover:scale-105 focus:scale-105' : ''
    const color = winIndex ? 'text-accent-primary' : activeBg ? ' text-white dark:text-black' : 'text-secondary'
    const shadowClasses =
        value === null
            ? activeBg
                ? 'shadow-neu-light-secondary-xs dark:shadow-neu-dark-secondary-xs active:shadow-neu-inset-light-secondary-xs dark:active:shadow-neu-inset-dark-secondary-xs'
                : 'shadow-neu-light-xs dark:shadow-neu-dark-xs'
            : activeBg
              ? 'shadow-neu-inset-light-secondary-xs dark:shadow-neu-inset-dark-secondary-xs'
              : 'shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs'

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Square ${value || 'empty'}`}
            aria-pressed={!!value}
            className={`${baseClasses} ${hoverClasses} ${shadowClasses} ${size} ${color}`}>
            {value && (
                <Icon
                    icon={value === 'X' ? 'line-md:close' : 'line-md:circle'}
                    className={`size-full ${winIndex ? 'animate-pulse-slow' : ''}`}
                    aria-hidden="true"
                />
            )}
        </button>
    )
}

export default memo(Square)
