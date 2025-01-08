import React from 'react'

const ScoreBoard = ({ playerX, playerO, drawScore }) => {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-5 px-4 tracking-wider">
            <div className="text-highlight shadow-neumorphic-inset-sm order-1 w-36 rounded-lg p-4 text-center sm:w-60">
                <h3 className="shadow-neumorphic-xs mb-2 rounded-lg p-3 font-bold">
                    <span className="line-clamp-1">{playerX.name}</span> (X)
                </h3>
                <div className="text-primary shadow-neumorphic-xs rounded-lg text-2xl">{playerX.score}</div>
            </div>
            <div className="text-highlight shadow-neumorphic-inset-sm order-3 w-36 rounded-lg p-4 text-center sm:order-2 sm:w-60">
                <h3 className="shadow-neumorphic-xs mb-2 rounded-lg p-3 font-bold">Draws</h3>
                <div className="text-primary shadow-neumorphic-xs rounded-lg text-2xl">{drawScore}</div>
            </div>
            <div className="text-highlight shadow-neumorphic-inset-sm order-2 w-36 rounded-lg p-4 text-center sm:order-3 sm:w-60">
                <h3 className="shadow-neumorphic-xs mb-2 rounded-lg p-3 font-bold">
                    <span className="line-clamp-1">{playerO.name}</span> (O)
                </h3>
                <div className="text-primary shadow-neumorphic-xs rounded-lg text-2xl">{playerO.score}</div>
            </div>
        </div>
    )
}

export default React.memo(ScoreBoard)
