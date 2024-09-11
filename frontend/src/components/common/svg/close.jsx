import React from 'react'

const Close = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" transform="rotate(180)" {...props}>
            <g id="Layer_3">
                <line
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth="4"
                    strokeDasharray={50}
                    strokeLinecap="round"
                    x1="8"
                    y1="40"
                    x2="40"
                    y2="8">
                    <animate attributeName="stroke-dashoffset" dur=".2s" from="50" to="0" repeatCount="freeze" />
                </line>
                <line
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeWidth="4"
                    strokeDasharray={50}
                    strokeLinecap="round"
                    x1="40"
                    y1="40"
                    x2="8"
                    y2="8">
                    <animate attributeName="stroke-dashoffset" dur=".2s" from="50" to="0" repeatCount="freeze" />
                </line>
            </g>
        </svg>
    )
}

export default Close
