import React from 'react'

import { useTicTacToeContext } from '../../../context/TicTacToeContext'

const UltimateTicTacToe = () => {
    const { state, updateBoard } = useTicTacToeContext()
    const { ultimateBoard, currentPlayer, winner } = state

    const handleCellClick = (boardIndex, cellIndex) => {
        if (!ultimateBoard[boardIndex][cellIndex] && !winner) {
            updateBoard(cellIndex, boardIndex)
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {ultimateBoard.map((board, boardIndex) => (
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
