import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../../constants/iconMap'
import cn from '../../../utils/cn'

const variants = {
    primary: {
        backgroundClass: 'bg-primary',
        gradientColors: '',
        textClass: 'group-hover:text-text-primary text-text-secondary',
        borderClass: '',
    },
    secondary: {
        backgroundClass: 'bg-secondary',
        gradientColors: 'dark:[--gradient-light:#575d65] dark:[--gradient-dark:#1f2937]',
        textClass: 'group-hover:text-text-primary text-text-secondary',
        borderClass: 'border-primary ',
    },
    danger: {
        backgroundClass: 'bg-red-600',
        gradientColors: '[--gradient-light:#ff6467] [--gradient-dark:#8f0007]',
        textClass: 'text-white',
        borderClass: 'border-red-400',
    },
    warning: {
        backgroundClass: 'bg-yellow-500',
        gradientColors: '[--gradient-light:#ffdf20] [--gradient-dark:#a37b00]',
        textClass: 'text-black',
        borderClass: 'border-yellow-300',
    },
    success: {
        backgroundClass: 'bg-green-500',
        gradientColors: '[--gradient-light:#4ade80] [--gradient-dark:#009335]',
        textClass: 'text-black',
        borderClass: 'border-green-300',
    },
    info: {
        backgroundClass: 'dark:bg-blue-600 bg-blue-500',
        gradientColors: '[--gradient-light:#50a2ff] [--gradient-dark:#003688]',
        textClass: 'text-white',
        borderClass: 'border-blue-400',
    },
    accent: {
        backgroundClass: 'bg-accent',
        gradientColors: '[--gradient-light:#ffac9d] [--gradient-dark:#a5260f]',
        textClass: 'text-white',
        borderClass: 'border-[#ffac9d]',
    },
}

/**
 * JelloButton Component
 *
 * A visually appealing button component with animated hover effects and customizable props.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Content inside the button.
 * @param {string} [props.className] - Additional CSS classes for the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.isSubmitting=false] - Whether the button shows a loading state.
 * @param {Function} [props.onClick] - Function to call on button click.
 * @param {string} [props.icon] - Icon to display in the button.
 * @param {string} [props.iconClasses] - CSS classes for the icon.
 * @param {string} [props.roundness='rounded-lg'] - Rounding style for the button.
 * @param {string} [props.title] - Tooltip text for the button.
 * @param {string} [props.type='button'] - Type of the button element.
 * @param {string} [props.variant='primary'] - Visual variant of the button. i.e., accent, primary, secondary, danger, warning, success, info.
 * @returns {React.Element}
 */
const JelloButton = ({
    children = '',
    className = '',
    contentClasses = '',
    disabled = false,
    isSubmitting = false,
    onClick = null,
    icon = null,
    iconClasses = '',
    roundness = 'rounded-lg',
    title = '',
    type = 'button',
    variant = 'primary',
}) => {
    const { backgroundClass, gradientColors, textClass, borderClass } = variants[variant] || variants.primary

    return (
        <button
            type={type}
            onClick={onClick}
            title={title}
            disabled={disabled || isSubmitting}
            className={cn(
                'group relative cursor-pointer border-none bg-transparent p-0',
                { 'cursor-not-allowed opacity-50': disabled },
                className,
                roundness
            )}>
            {/* Shadow Layer */}
            <span
                className={`${roundness} absolute top-0 left-0 h-full w-full translate-y-0.5 bg-black/25 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-focus:translate-y-1 group-focus:duration-[250ms] group-active:translate-y-px group-active:duration-[34ms]`}></span>

            {/* Gradient Layer */}
            <span className={`${gradientColors} ${roundness} bg-layer-gradient absolute top-0 left-0 h-full w-full`}></span>

            {/* Button Content */}
            <div
                className={cn(
                    `${backgroundClass} ${textClass} ${borderClass} ${roundness}`,
                    'relative flex items-center justify-center gap-1 border px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
                    '-translate-y-1 transition-all duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-focus:-translate-y-1.5 group-focus:duration-[250ms] group-active:-translate-y-0.5 group-active:duration-[34ms]',
                    icon ? 'p-1' : '',
                    contentClasses
                )}>
                {isSubmitting ? (
                    <Icon icon={iconMap.loading} className="size-6" />
                ) : (
                    <>
                        {icon && <Icon icon={icon} className={cn('size-5 shrink-0', iconClasses)} />}
                        {children}
                    </>
                )}
            </div>
        </button>
    )
}

export default JelloButton
