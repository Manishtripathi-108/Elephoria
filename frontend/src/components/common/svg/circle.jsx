import React from 'react'

const Circle = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            transform="rotate(-90)"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={50}
            strokeLinecap="round"
            strokeDashoffset={50}
            {...props}>
            <circle className="animate-close-n-zero" cx="12" cy="12" r="8" />
        </svg>
    )
}

export default Circle
