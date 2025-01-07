import React from 'react'

import { Icon } from '@iconify/react'

import iconMap from '../../../constants/iconMap'
import cn from '../../../utils/cn'

const variants = {
    primary: {
        backgroundClass: 'bg-primary',
        gradientClass: 'bg-primary-gradient dark:bg-primary-dark-gradient',
        textClass: 'text-primary',
        borderClass: '',
    },
    secondary: {
        backgroundClass: 'bg-secondary',
        gradientClass: 'bg-secondary-gradient dark:bg-secondary-dark-gradient',
        textClass: 'text-primary',
        borderClass: 'border-light-primary dark:border-dark-primary',
    },
    danger: {
        backgroundClass: 'bg-red-600',
        gradientClass: 'bg-red-gradient',
        textClass: 'text-white',
        borderClass: 'border-red-400',
    },
    warning: {
        backgroundClass: 'dark:bg-yellow-500 bg-yellow-400',
        gradientClass: 'bg-yellow-gradient',
        textClass: 'text-black',
        borderClass: 'border-yellow-300',
    },
    success: {
        backgroundClass: 'bg-green-500',
        gradientClass: 'bg-green-gradient',
        textClass: 'text-white',
        borderClass: 'border-green-300',
    },
    info: {
        backgroundClass: 'dark:bg-blue-600 bg-blue-500',
        gradientClass: 'bg-blue-gradient',
        textClass: 'text-white',
        borderClass: 'border-blue-400',
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
 * @param {boolean} [props.iconOnly=false] - If true, only shows the icon.
 * @param {string} [props.roundness='rounded-lg'] - Rounding style for the button.
 * @param {string} [props.title] - Tooltip text for the button.
 * @param {string} [props.type='button'] - Type of the button element.
 * @param {string} [props.variant='primary'] - Visual variant of the button.
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
    iconOnly = false,
    roundness = 'rounded-lg',
    title = '',
    type = 'button',
    variant = 'primary',
}) => {
    const { backgroundClass, gradientClass, textClass, borderClass } = variants[variant] || variants.primary

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
            <span className={`${gradientClass} ${roundness} absolute top-0 left-0 h-full w-full`}></span>

            {/* Button Content */}
            <div
                className={cn(
                    `${backgroundClass} ${textClass} ${borderClass} ${roundness}`,
                    'relative flex items-center justify-center gap-1 border px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
                    '-translate-y-1 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-focus:-translate-y-1.5 group-focus:duration-[250ms] group-active:-translate-y-0.5 group-active:duration-[34ms]',
                    iconOnly ? 'p-1' : '',
                    contentClasses
                )}>
                {isSubmitting ? (
                    <Icon icon={iconMap.loading} className="size-5" />
                ) : (
                    <>
                        {icon && <Icon icon={icon} className={cn('size-4 shrink-0', iconClasses)} />}
                        {!iconOnly && children}
                    </>
                )}
            </div>
        </button>
    )
}

export default JelloButton
