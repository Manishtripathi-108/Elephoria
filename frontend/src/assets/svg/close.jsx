import React from 'react'

const Close = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" transform="rotate(180)" {...props}>
            <g id="Layer_3">
                <line
                    className="animate-close-n-zero stroke-current"
                    x1="8"
                    y1="40"
                    x2="40"
                    y2="8"
                    strokeDashoffset={50}
                    strokeWidth="4"
                    strokeDasharray="50"
                    strokeLinecap="round"
                />
                <line
                    className="animate-close-n-zero stroke-current"
                    x1="40"
                    y1="40"
                    x2="8"
                    y2="8"
                    strokeDashoffset={50}
                    strokeWidth="4"
                    strokeDasharray="50"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    )
}

export default Close
