import React from 'react'

import { useTicTacToeContext } from '../../../context/TicTacToeContext'

const ClassicTicTacToe = () => {
    const { state, makeMove, resetGame } = useTicTacToeContext()
    const { boardClassic, currentPlayer, winner, isDraw } = state

    const handleClick = (index) => {
        if (!boardClassic[index] && !winner) {
            makeMove(index)
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {boardClassic.map((cell, index) => (
                <button key={index} className="neu-btn" onClick={() => handleClick(index)}>
                    {cell}
                </button>
            ))}
            {winner && <p>{`Winner: ${winner}`}</p>}
            {isDraw && <p>It's a draw!</p>}
            <button onClick={resetGame} className="neu-btn">
                Reset Game
            </button>
        </div>
    )
}

export default ClassicTicTacToe
