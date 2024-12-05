import React from 'react'

const ScoreBoard = ({ playerX, playerO, drawScore }) => {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-5 px-4 tracking-wider">
            <div className="text-highlight order-1 w-36 rounded-lg p-4 text-center shadow-neumorphic-inset-sm sm:w-60">
                <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neumorphic-xs">
                    <span className="line-clamp-1">{playerX.name}</span> (X)
                </h3>
                <div className="text-primary rounded-lg text-2xl shadow-neumorphic-xs">{playerX.score}</div>
            </div>
            <div className="text-highlight order-3 w-36 rounded-lg p-4 text-center shadow-neumorphic-inset-sm sm:order-2 sm:w-60">
                <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neumorphic-xs">Draws</h3>
                <div className="text-primary rounded-lg text-2xl shadow-neumorphic-xs">{drawScore}</div>
            </div>
            <div className="text-highlight order-2 w-36 rounded-lg p-4 text-center shadow-neumorphic-inset-sm sm:order-3 sm:w-60">
                <h3 className="mb-2 rounded-lg p-3 font-bold shadow-neumorphic-xs">
                    <span className="line-clamp-1">{playerO.name}</span> (O)
                </h3>
                <div className="text-primary rounded-lg text-2xl shadow-neumorphic-xs">{playerO.score}</div>
            </div>
        </div>
    )
}

export default React.memo(ScoreBoard)
