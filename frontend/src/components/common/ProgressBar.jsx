import React from 'react'

const ProgressBar = ({ total, current, percentage = '', name = '' }) => {
    if (percentage === '') {
        percentage = (current / total) * 100
    }

    return (
        <div className="bg-primary grid w-full max-w-sm place-items-center gap-3 rounded-2xl p-5 shadow-neumorphic-md">
            {/* Progress Bar */}
            <div className="flex h-5 w-full items-center justify-start rounded-3xl shadow-neumorphic-inset-xs">
                <div
                    className="bg-accent h-full w-20 animate-pulse rounded-3xl"
                    style={{ width: `${percentage || 0}%` }}
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                    aria-label={`${percentage}% progress`}></div>
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
