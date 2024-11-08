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
            <div className="relative z-0 w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md">
                {/* <div
                    tabIndex={0}
                    className={`grid ${boardSize === 9 ? 'grid-cols-3' : boardSize === 16 ? 'grid-cols-4' : 'grid-cols-5'} gap-1 outline-none`}
                    id="game-board">
                    {boardClassic.map((value, index) => renderSquare(value, index))}
                </div> */}

                {/* Game Over Modal */}
                {/* {isGameOver && (
                    <GameOverModal
                        initializeGame={initializeGame}
                        playerXName={playerX.name}
                        playerOName={playerO.name}
                        isDraw={isDraw}
                        winner={winner}
                    />
                )} */}

                {/* Reset Game & Board Size Select */}
                {/* <div className="mt-3 flex items-center justify-end gap-5">
                    <div className="neu-form-group w-32">
                        <select
                            className="neu-form-select"
                            value={boardSize}
                            onChange={(e) => changeBoardSize(e.target.value)}
                            aria-label="Select board size">
                            <option value={9}>3 x 3</option>
                            <option value={16}>4 x 4</option>
                            <option value={25}>5 x 5</option>
                        </select>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default ClassicTicTacToe
