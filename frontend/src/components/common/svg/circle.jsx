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
            {...props}>
            <circle cx="12" cy="12" r="8" />
            <animate attributeName="stroke-dashoffset" dur=".2s" from="50" to="0" repeatCount="freeze" />
        </svg>
    )
}

export default Circle
