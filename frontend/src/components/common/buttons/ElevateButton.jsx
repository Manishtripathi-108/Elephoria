import React from 'react'

import cn from '../../../utils/cn'

const ElevateButton = React.forwardRef(({ children, onClick, title = '', className = '', variant = 'primary', disabled = false, ...props }, ref) => {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                `group inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-[linear-gradient(145deg,var(--gradient-start),var(--gradient-end))] p-1.5 shadow-neumorphic-xs duration-500 hover:scale-105 ${className}`,
                {
                    'text-secondary border-light-secondary [--gradient-end:#e6a4a7] [--gradient-start:#ffc3c6] [--sh-end:#ffcfd3] [--sh-start:#db9d9f] dark:border-dark-secondary dark:[--gradient-end:#364253] dark:[--gradient-start:#1f2937] dark:[--sh-end:#324258] dark:[--sh-start:#0c1016]':
                        variant === 'primary',
                    'text-primary border-light-primary [--gradient-end:#fff4f4] [--gradient-start:#FFE6E6] dark:border-dark-primary dark:[--gradient-end:#4b5a6c] dark:[--gradient-start:#334155]':
                        variant === 'secondary',
                    'border-red-400 text-white [--gradient-end:#FF6347] [--gradient-start:#dc2626] [--sh-end:#ff3131] [--sh-start:#9a1b1b] dark:[--gradient-end:#FF6347]':
                        variant === 'danger',
                    'border-yellow-300 text-black [--gradient-end:#FFD700] [--gradient-start:#facc15] [--sh-end:#ffff1d] [--sh-start:#967a0d] dark:[--gradient-end:#ffdc50]':
                        variant === 'warning',
                    'border-green-400 text-white [--gradient-end:#4ade80] [--gradient-start:#16a34a] [--sh-end:#22c55e] [--sh-start:#0f5132] dark:[--gradient-end:#4ade80]':
                        variant === 'success',
                    'border-blue-400 text-white [--gradient-end:#3b82f6] [--gradient-start:#1d4ed8] [--sh-end:#296dff] [--sh-start:#112f82] dark:[--gradient-end:#3b82f6]':
                        variant === 'info',
                }
            )}
            ref={ref}
            {...props}>
            <div
                className={`flex size-full shrink-0 grow-0 items-center justify-center gap-2 rounded-full bg-inherit px-2 py-1 font-medium shadow-[3px_3px_5px_var(--sh-start),-3px_-3px_5px_var(--sh-end)] transition-all ${disabled ? '' : 'group-active:shadow-none'}`}>
                {children}
            </div>
        </button>
    )
})

export default React.memo(ElevateButton)
