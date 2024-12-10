import React from 'react'

import { Icon } from '@iconify/react'

import cn from '../../../utils/cn'
import { iconMap } from '../../../utils/globalConstants'

/**
 * JelloButton is a custom button component that implements a "jello" style animation,
 * with a subtle shadow and background gradient effect when hovered or focused.
 * It accepts the following props:
 *
 * - `children`: The content of the button, which can be a string or any React component.
 * - `className`: Additional CSS classes to apply to the button element.
 * - `disabled`: Whether the button is disabled or not. If true, the button will be
 *   rendered with a reduced opacity and a "cursor-not-allowed" cursor.
 * - `isSubmitting`: Whether the button is currently in a submitting state or not.
 *   If true, the button will render a loading animation instead of the content.
 * - `onClick`: The event handler to call when the button is clicked.
 * - `title`: The title attribute of the button element, which can be used as a tooltip.
 * - `type`: The type of button element to render. Defaults to "button".
 * - `variant`: The color variant of the button. Can be one of "primary", "secondary",
 *   "danger", "warning", "success", or "info". Defaults to "primary".
 */
const JelloButton = ({ children = '', className, disabled = false, isSubmitting = false, onClick, title = '', type, variant = 'primary' }) => {
    const variants = {
        primary: ['bg-primary', 'bg-primary-gradient', 'text-primary', 'border-light-secondary dark:border-dark-secondary'],
        secondary: ['bg-secondary', 'bg-secondary-gradient', 'text-primary', 'border-light-primary dark:border-dark-primary'],
        danger: ['bg-red-600', 'bg-red-gradient', 'text-white', 'border-red-500'],
        warning: ['bg-yellow-500', 'bg-yellow-gradient', 'text-black', 'border-yellow-400'],
        success: ['bg-green-500', 'bg-green-gradient', 'text-white', 'border-green-400'],
        info: ['bg-blue-500', 'bg-blue-gradient', 'text-white', 'border-blue-400'],
    }

    const [bgFront, layer, text, border] = variants[variant] || variants.primary

    return (
        <button
            type={type || 'button'}
            onClick={onClick}
            title={title}
            disabled={disabled || isSubmitting}
            className={cn('group/btn relative cursor-pointer rounded-lg border-none bg-transparent p-0 text-sm', className, {
                'cursor-not-allowed opacity-50': disabled,
            })}>
            <span
                className={`absolute left-0 top-0 h-full w-full translate-y-0.5 rounded-lg bg-black/25 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:translate-y-1 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-focus/btn:translate-y-1 group-focus/btn:transition-transform group-focus/btn:duration-[250ms] group-focus/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:translate-y-px group-active/btn:transition-transform group-active/btn:duration-[34ms]`}></span>
            <span className={`${layer} absolute left-0 top-0 h-full w-full rounded-lg`}></span>

            <div
                className={`${bgFront} ${text} ${border} relative flex -translate-y-1 items-center justify-center rounded-lg border px-4 py-2 text-sm transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:-translate-y-1.5 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-focus/btn:-translate-y-1.5 group-focus/btn:transition-transform group-focus/btn:duration-[250ms] group-focus/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:-translate-y-0.5 group-active/btn:transition-transform group-active/btn:duration-[34ms]`}>
                {isSubmitting ? (
                    <Icon icon={iconMap.loading} className="h-5 w-5" />
                ) : (
                    <span className="w-full select-none">{children || 'Click me'}</span>
                )}
            </div>
        </button>
    )
}

export default JelloButton
