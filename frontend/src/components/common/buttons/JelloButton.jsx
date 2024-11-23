import React from 'react'

import { twMerge } from 'tailwind-merge'

const JelloButton = ({ onClick, title = '', variant = 'primary', children = '', className }) => {
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
            onClick={onClick}
            title={title}
            className={twMerge(
                `group/btn relative cursor-pointer rounded-lg border-none bg-transparent p-0   tracking-wider ${className}`
            )}>
            <span
                className={`absolute left-0 top-0 h-full w-full translate-y-0.5 rounded-lg bg-black/25 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:translate-y-1 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-focus/btn:translate-y-1 group-focus/btn:transition-transform group-focus/btn:duration-[250ms] group-focus/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:translate-y-px group-active/btn:transition-transform group-active/btn:duration-[34ms]`}></span>
            <span className={`${layer} absolute left-0 top-0 h-full w-full rounded-lg`}></span>

            <div
                className={`${bgFront} ${text} ${border} relative flex -translate-y-1 items-center justify-center rounded-lg border px-4 py-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:-translate-y-1.5 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-focus/btn:-translate-y-1.5 group-focus/btn:transition-transform group-focus/btn:duration-[250ms] group-focus/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:-translate-y-0.5 group-active/btn:transition-transform group-active/btn:duration-[34ms]`}>
                <span className="select-none">{children || 'Click me'}</span>
            </div>
        </button>
    )
}

export default JelloButton
