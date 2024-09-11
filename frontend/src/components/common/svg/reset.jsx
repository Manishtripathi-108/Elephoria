import React from 'react'

function Reset(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" {...props}>
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 6.5h-4v-4"></path>
                <path strokeDasharray={50} d="M3.578 6.487A8 8 0 1 1 2.5 10.5">
                    <animate attributeName="stroke-dashoffset" dur=".5s" from="50" to="0" repeatCount="freeze" />
                </path>
            </g>
            {/* <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="1s" repeatCount="indefinite" /> */}
        </svg>
    )
}

export default Reset
