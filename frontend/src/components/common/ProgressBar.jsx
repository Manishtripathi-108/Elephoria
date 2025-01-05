import React from 'react'

const ProgressBar = ({ total, current, percentage = '', name = '' }) => {
    if (percentage === '') {
        percentage = (current / total) * 100
    }

    return (
        <div className="bg-primary grid w-full max-w-sm place-items-center gap-3 rounded-2xl p-5 shadow-neumorphic-md">
            {/* Progress Bar */}
            <div className="bg-primary relative block w-full rounded-full border border-light-secondary p-1 text-base leading-4 shadow-neumorphic-inset-xs dark:border-dark-secondary">
                <span
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        transition: 'width 0.3s ease-in-out',
                    }}
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                    aria-label={`${percentage}% progress`}
                    className="bg-linear-to-t relative inline-block h-5 overflow-hidden rounded-full border border-inherit from-light-accent/70 to-light-accent bg-cover align-middle after:absolute after:inset-0 after:animate-progress-after after:bg-[linear-gradient(_45deg,#ffffff_25%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_50%,#ffffff_50%,#ffffff_75%,rgba(0,0,0,0)_75%,rgba(0,0,0,0)_)] after:bg-[length:30px_30px] after:opacity-30 dark:from-dark-accent/70 dark:to-dark-accent"></span>
            </div>

            <span className="text-primary text-center font-aladin text-sm tracking-widest">
                {!isNaN(percentage) ? `${current}/${total} (${Math.round(percentage)}%)` : 'Processing...'}
            </span>

            {/* Name/Label Display */}
            {name && <p className="text-primary h-10 text-center font-medium capitalize tracking-wide">{name}</p>}
        </div>
    )
}

export default React.memo(ProgressBar)
