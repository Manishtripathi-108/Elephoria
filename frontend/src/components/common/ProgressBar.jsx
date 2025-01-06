import React from 'react'

const ProgressBar = ({ total, current, percentage = '', name = '' }) => {
    if (percentage === '') {
        percentage = (current / total) * 100
    }

    return (
        <div className="bg-primary shadow-neumorphic-md grid w-full max-w-sm place-items-center gap-3 rounded-2xl p-5">
            {/* Progress Bar */}
            <div className="bg-primary border-light-secondary shadow-neumorphic-inset-xs dark:border-dark-secondary relative block w-full rounded-full border p-1 text-base leading-4">
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
                    className="from-light-accent/70 to-light-accent after:animate-progress-after dark:from-dark-accent/70 dark:to-dark-accent relative inline-block h-5 overflow-hidden rounded-full border border-inherit bg-linear-to-t bg-cover align-middle after:absolute after:inset-0 after:bg-[linear-gradient(_45deg,#ffffff_25%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_50%,#ffffff_50%,#ffffff_75%,rgba(0,0,0,0)_75%,rgba(0,0,0,0)_)] after:bg-[length:30px_30px] after:opacity-30"></span>
            </div>

            <span className="text-primary font-aladin text-center text-sm tracking-widest">
                {!isNaN(percentage) ? `${current}/${total} (${Math.round(percentage)}%)` : 'Processing...'}
            </span>

            {/* Name/Label Display */}
            {name && <p className="text-primary h-10 text-center font-medium tracking-wide capitalize">{name}</p>}
        </div>
    )
}

export default React.memo(ProgressBar)
