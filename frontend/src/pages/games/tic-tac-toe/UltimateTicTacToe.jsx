import React from 'react'

import { useTicTacToeContext } from '../../../context/TicTacToeContext'

const UltimateTicTacToe = () => {
    const { state, makeMove } = useTicTacToeContext()
    const { boardUltimate, currentPlayer, winner } = state

    const handleCellClick = (boardIndex, cellIndex) => {
        if (!boardUltimate[boardIndex][cellIndex] && !winner) {
            makeMove(cellIndex, boardIndex)
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {boardUltimate.map((board, boardIndex) => (
                <div key={boardIndex} className="border p-2">
                    {board.map((cell, cellIndex) => (
                        <button key={cellIndex} className="neu-btn" onClick={() => handleCellClick(boardIndex, cellIndex)}>
                            {cell}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default UltimateTicTacToe
