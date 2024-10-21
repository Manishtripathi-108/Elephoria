import React from 'react'

// CircularProgress Component
CircularProgress = ({ percent = 50, size = 120, strokeWidth = 10, color = '#3b82f6', textColor = '#1e3a8a' }) => {
    // Circle properties
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percent / 100) * circumference

    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
                {/* Background Circle */}
                <circle className="text-gray-300" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                {/* Progress Circle */}
                <circle
                    className="text-blue-600"
                    strokeWidth={strokeWidth}
                    stroke={color} // Dynamic stroke color
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
            </svg>
            {/* Percentage Text */}
            <span className="absolute text-2xl" style={{ color: textColor }}>
                {`${percent}%`}
            </span>
        </div>
    )
}

export default CircularProgress
