import React from 'react'

import cn from '../utils/cn'

/**
 * A double-bordered component, with a neumorphic shadow effect.
 * Intended to be used as a visual wrapper for components that need a bit of
 * visual flair. The outer border is a thicker, rounded rectangle, while the
 * inner border is a thinner, rounded rectangle with more padding.
 *
 * @param {React.ReactNode} children The content to be wrapped in the double border.
 * @param {string} [className] Additional CSS classes to add to the outermost element.
 * @param {string} [innerClassName] Additional CSS classes to add to the inner element.
 * @returns {React.ReactElement} A JSX element representing the double-bordered component.
 */

const DoubleBorder = ({ children, className, innerClassName }) => {
    return (
        <div className={cn('shadow-neumorphic-lg bg-primary rounded-2xl border p-2 sm:p-6', className)}>
            <div className={cn('w-full rounded-xl border p-6', innerClassName)}>{children}</div>
        </div>
    )
}

export default DoubleBorder
