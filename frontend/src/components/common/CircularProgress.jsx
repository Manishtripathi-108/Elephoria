import React from 'react'

const CircularProgress = ({ percentage, size = 100, stroke = 6 }) => {
    const radius = size / 2 - stroke // Adjust for stroke width
    const circumference = 2 * Math.PI * radius
    const progressOffset = circumference - (percentage / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Neumorphic Shadow Background */}
            <svg width={size} height={size} className="absolute">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={stroke}
                    className="stroke-secondary shadow-neumorphic-inset-xs fill-none"
                    style={{ filter: 'drop-shadow(3px 3px 5px var(--lower-shadow)) drop-shadow(2px 2px 2px var(--upper-shadow))' }}
                />
            </svg>

            {/* Progress Circle */}
            <svg width={size} height={size} className="absolute">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={stroke}
                    className="stroke-accent origin-center -rotate-90 transform fill-none transition-all duration-500"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Percentage Text */}
            <span className="text-text-primary text-2xl font-bold">{percentage}%</span>
        </div>
    )
}

export default CircularProgress
