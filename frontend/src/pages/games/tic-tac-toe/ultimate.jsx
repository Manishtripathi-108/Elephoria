import { React, useState } from 'react'

import NeuButton from '../../../components/common/buttons/neu-button'
import Circle from '../../../components/common/svg/circle'
import Close from '../../../components/common/svg/close'
import GamePad from '../../../components/common/svg/gamepad'
import Reset from '../../../components/common/svg/reset'
import GameOverModal from './components/game-over-modal'
import Heading from './components/heading'
import PlayerNameModal from './components/player-name-modal'

const Ultimate = () => {
    // Macro board: 9 elements to track the state of each small 3x3 board (won, playable, etc.)
    const [macroBoard, setMacroBoard] = useState(Array(9).fill(null))

    // Micro board: 9x9 grid, each representing a cell in the 9 smaller boards.
    const [microBoards, setMicroBoards] = useState(Array.from({ length: 9 }, () => Array(9).fill(null)))

    const [isXNext, setIsXNext] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [playerXName, setPlayerXName] = useState('Player 1')
    const [playerOName, setPlayerOName] = useState('Player 2')
    const [playerXScore, setPlayerXScore] = useState(0)
    const [playerOScore, setPlayerOScore] = useState(0)

    const renderSquare = (value, macroIndex, microIndex) => {
        return (
            <button
                type="button"
                tabIndex="10"
                key={`${macroIndex}-${microIndex}`}
                className={`flex-center text-secondary bg-primary p-1 md:p-3 size-7 md:size-16 rounded-md ${value === null ? 'shadow-neu-light-xs dark:shadow-neu-dark-xs' : 'shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs'}`}
                onClick={() => handleSquareClick(macroIndex, microIndex)}>
                {value === 'X' && <Close className={`svg-shadow-light-xs dark:svg-shadow-dark-xs size-full`} />}
                {value === 'O' && <Circle className={`svg-shadow-light-xs dark:svg-shadow-dark-xs size-full`} />}
            </button>
        )
    }

    const handleSquareClick = (macroIndex, microIndex) => {
        if (microBoards[macroIndex][microIndex]) return

        // Mark the cell with the current player's mark (X or O)
        const newMicroBoards = microBoards.map((board, i) =>
            i === macroIndex ? board.map((cell, j) => (j === microIndex ? (isXNext ? 'X' : 'O') : cell)) : board
        )
        setMicroBoards(newMicroBoards)

        // Switch turns
        setIsXNext(!isXNext)

        // Optionally, add game-winning logic here
    }

    return (
        <div className="grid place-items-center">
            {/* Heading */}
            <Heading title="Ultimate Tic-Tac-Toe" />

            <div className="flex w-full flex-col flex-wrap items-center justify-around gap-5  py-5 md:flex-row md:items-start">
                {/* Game Board */}
                <div className="relative w-fit p-2 shadow-neu-light-md dark:shadow-neu-dark-md rounded-lg">
                    <div className="grid grid-cols-3 gap-2">
                        {microBoards.map((macroBoard, macroIndex) => (
                            <div
                                key={macroIndex}
                                className="relative grid grid-cols-3 md:gap-3 md:p-3 p-2 gap-2 shadow-neu-inset-light-xs dark:shadow-neu-inset-dark-xs rounded-md">
                                {/* Render each micro board inside its corresponding macro board */}
                                {macroBoard.map((microBoardCell, microIndex) => renderSquare(microBoardCell, macroIndex, microIndex))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ultimate
