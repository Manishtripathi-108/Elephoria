import React from 'react'

/**
 * LoadingState
 *
 * A component that renders a loading animation with circles that jump up and down.
 *
 * @param {Object} props Component props
 * @prop {string} [baseHeight='40%'] The height of the base of the loading animation
 * @prop {string} [circleSize='30px'] The size of each circle in the loading animation
 * @prop {string} [jumpHeight='35%'] The height of the jump animation
 * @prop {string} [width] The width of the component: tailwindcss classes
 * @prop {string} [height] The height of the component: tailwindcss classes
 *
 * @returns {ReactElement} The component
 */
const LoadingState = ({ baseHeight = '40%', circleSize = '30px', jumpHeight = '35%', width, height }) => {
    const styles = {
        '--loader-base-height': baseHeight,
        '--loader-circle-size': circleSize,
        '--loader-jump-height': jumpHeight,
    }
    return (
        <div
            className={`flex-center ${width ? `${width}` : 'w-full'} ${height ? `${height}` : 'h-[calc(100vh-var(--header-height)-2px)]'}`}
            style={styles}>
            <div className="relative h-full min-h-20 w-full max-w-sm">
                <div className="bg-highlight absolute bottom-[calc(var(--loader-base-height)+var(--loader-jump-height))] left-[calc(25%-var(--loader-circle-size)/2)] size-[var(--loader-circle-size)] origin-center animate-loader-circle rounded-full"></div>
                <div className="bg-highlight absolute bottom-[calc(var(--loader-base-height)+var(--loader-jump-height))] left-[calc(50%-var(--loader-circle-size)/2)] size-[var(--loader-circle-size)] origin-center animate-loader-circle rounded-full [--animation-delay:.1s]"></div>
                <div className="bg-highlight absolute bottom-[calc(var(--loader-base-height)+var(--loader-jump-height))] left-[calc(75%-var(--loader-circle-size)/2)] size-[var(--loader-circle-size)] origin-center animate-loader-circle rounded-full [--animation-delay:.2s]"></div>
                <div className="absolute bottom-[calc(var(--loader-base-height)-4px)] left-[calc(25%-var(--loader-circle-size)/2)] -z-10 h-1 w-[var(--loader-circle-size)] origin-center animate-loader-shadow rounded-full bg-black blur-[1px]"></div>
                <div className="absolute bottom-[calc(var(--loader-base-height)-4px)] left-[calc(50%-var(--loader-circle-size)/2)] -z-10 h-1 w-[var(--loader-circle-size)] origin-center animate-loader-shadow rounded-full bg-black blur-[1px] [--animation-delay:.1s]"></div>
                <div className="absolute bottom-[calc(var(--loader-base-height)-4px)] left-[calc(75%-var(--loader-circle-size)/2)] -z-10 h-1 w-[var(--loader-circle-size)] origin-center animate-loader-shadow rounded-full bg-black blur-[1px] [--animation-delay:.2s]"></div>
            </div>
        </div>
    )
}

export default LoadingState
