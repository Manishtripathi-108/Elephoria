import React from 'react'

const JelloButton = ({ onClick, title = '', variant = 'primary', children, ...props }) => {
    // Define button variants
    const variants = {
        primary: {
            bgFront: 'bg-primary',
            layer: 'bg-primary-gradient',
            text: 'text-primary',
            border: 'border-light-primary dark:border-dark-primary',
        },
        secondary: {
            bgFront: 'bg-secondary',
            layer: 'bg-secondary-gradient',
            text: 'text-primary',
            border: 'border-light-primary dark:border-dark-primary',
        },
        danger: {
            bgFront: 'bg-red-600',
            layer: 'bg-red-gradient',
            text: 'text-white',
            border: 'border-red-500',
        },
        warning: {
            bgFront: 'bg-yellow-500',
            layer: 'bg-yellow-gradient',
            text: 'text-black',
            border: 'border-yellow-400',
        },
        success: {
            bgFront: 'bg-green-500',
            layer: 'bg-green-gradient',
            text: 'text-white',
            border: 'border-green-400',
        },
        info: {
            bgFront: 'bg-blue-500',
            layer: 'bg-blue-gradient',
            text: 'text-white',
            border: 'border-blue-400',
        },
    }

    // Default to primary if the provided variant is invalid
    const { bgFront, layer, text, border } = variants[variant] || variants.primary

    return (
        <button
            onClick={onClick}
            title={title}
            className="group/btn relative cursor-pointer border-none bg-transparent p-0 font-indie-flower tracking-wider outline-none"
            {...props}>
            <span
                className={`absolute left-0 top-0 h-full w-full translate-y-0.5 rounded-lg bg-black/25 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:translate-y-1 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:translate-y-px group-active/btn:transition-transform group-active/btn:duration-[34ms]`}></span>
            <span className={`${layer} absolute left-0 top-0 h-full w-full rounded-lg`}></span>

            <div
                className={`${bgFront} ${text} ${border} relative flex -translate-y-1 items-center justify-center rounded-lg border px-4 py-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/btn:-translate-y-1.5 group-hover/btn:transition-transform group-hover/btn:duration-[250ms] group-hover/btn:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active/btn:-translate-y-0.5 group-active/btn:transition-transform group-active/btn:duration-[34ms]`}>
                <span className="select-none">{children || 'Click me'}</span>
            </div>
        </button>
    )
}

export default JelloButton
