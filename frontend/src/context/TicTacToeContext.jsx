import React, { createContext, useContext, useReducer } from 'react'

import { evaluateBoardStatus } from '../utils/TicTacToeConst'

// Initial State
const initialState = {
    mode: 'classic', // 'classic' or 'ultimate'
    isXNext: true,
    classicBoard: Array(9).fill(null),
    ultimateBoard: Array(9).fill(Array(9).fill(null)),
    isGameOver: false,
    winner: null,
    winIndexes: null,
    isDraw: false,
    drawScore: 0,
    activeIndex: null,
    playerX: { name: 'Player 1', score: 0 },
    playerO: { name: 'Player 2', score: 0 },
}

// Game Reducer
const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MODE':
            if (!['classic', 'ultimate'].includes(action.payload)) {
                console.error('Invalid game mode:', action.payload)
                return state
            }
            return {
                ...initialState,
                mode: action.payload,
                playerX: state.playerX,
                playerO: state.playerO,
            }

        case 'SET_PLAYER_NAMES':
            return {
                ...state,
                playerX: { ...state.playerX, name: action.payload.playerX },
                playerO: { ...state.playerO, name: action.payload.playerO },
            }

        case 'HANDLE_MOVE':
            // debugger
            if (state.mode === 'classic') {
                const { macroIndex } = action.payload
                const { classicBoard, isGameOver, isXNext } = state

                if (classicBoard[macroIndex] || isGameOver) return state

                const updatedBoard = classicBoard.map((cell, i) => (i === macroIndex ? (isXNext ? 'X' : 'O') : cell))
                const result = evaluateBoardStatus(updatedBoard)

                const newState = {
                    ...state,
                    classicBoard: updatedBoard,
                    isXNext: !state.isXNext,
                    isGameOver: result.status !== 'continue',
                    winner: result.status === 'win' ? (result.winner === 'X' ? state.playerX.name : state.playerO.name) : null,
                    winIndexes: result.status === 'win' ? result.line : null,
                    isDraw: result.status === 'draw',
                }

                if (result.status === 'win') {
                    const playerKey = result.winner === 'X' ? 'playerX' : 'playerO'
                    newState[playerKey] = {
                        ...state[playerKey],
                        score: state[playerKey].score + 1,
                    }
                }

                if (result.status === 'draw') {
                    newState.drawScore = state.drawScore + 1
                }

                return newState
            } else {
                const { macroIndex, cellIndex } = action.payload
                const { ultimateBoard, classicBoard, isGameOver, isXNext, activeIndex } = state

                if (
                    isGameOver ||
                    ultimateBoard[macroIndex][cellIndex] ||
                    (activeIndex !== null && activeIndex !== macroIndex) ||
                    classicBoard[macroIndex]
                ) {
                    return state
                }

                // Update the small board with current player's move
                const updatedUltimateBoard = ultimateBoard.map((macroBoard, i) =>
                    i === macroIndex ? macroBoard.map((cell, j) => (j === cellIndex ? (isXNext ? 'X' : 'O') : cell)) : macroBoard
                )

                // Evaluate mini board status
                const miniBoardStatus = evaluateBoardStatus(updatedUltimateBoard[macroIndex])
                const updatedClassicBoard = [...classicBoard]

                if (miniBoardStatus.status === 'win') {
                    updatedClassicBoard[macroIndex] = miniBoardStatus.winner
                } else if (miniBoardStatus.status === 'draw') {
                    updatedClassicBoard[macroIndex] = 'D'
                }

                // Check if the large board has a winner or draw
                const largeBoardStatus = evaluateBoardStatus(updatedClassicBoard)

                const newState = {
                    ...state,
                    ultimateBoard: updatedUltimateBoard,
                    classicBoard: updatedClassicBoard,
                    isXNext: !state.isXNext,
                    isGameOver: largeBoardStatus.status !== 'continue',
                    winner: largeBoardStatus.status === 'win' ? (largeBoardStatus.winner === 'X' ? state.playerX.name : state.playerO.name) : null,
                    winIndexes: largeBoardStatus.status === 'win' ? largeBoardStatus.line : null,
                    isDraw: largeBoardStatus.status === 'draw',
                    activeIndex: updatedClassicBoard[cellIndex] ? null : cellIndex,
                }

                if (largeBoardStatus.status === 'win') {
                    const playerKey = largeBoardStatus.winner === 'X' ? 'playerX' : 'playerO'
                    newState[playerKey] = {
                        ...state[playerKey],
                        score: state[playerKey].score + 1,
                    }
                }

                if (largeBoardStatus.status === 'draw') {
                    newState.drawScore = state.drawScore + 1
                }

                return newState
            }

        case 'UPDATE_BOARD':
            const boardKey = state.mode === 'classic' ? 'classicBoard' : 'ultimateBoard'
            return {
                ...state,
                [boardKey]: action.payload,
                isXNext: !state.isXNext,
            }

        case 'UPDATE_CLASSIC_BOARD':
            return {
                ...state,
                classicBoard: action.payload,
            }

        case 'SET_ACTIVE_INDEX':
            return {
                ...state,
                activeIndex: action.payload,
            }

        case 'START_OVER':
            return {
                ...initialState,
                mode: state.mode,
            }

        case 'CLEAR_BOARD':
            return {
                ...initialState,
                isXNext: Math.random() < 0.5,
                mode: state.mode,
                drawScore: state.drawScore,
                playerX: state.playerX,
                playerO: state.playerO,
            }

        case 'DECLARE_WINNER':
            const winnerKey = action.payload.winner === 'X' ? 'playerX' : 'playerO'
            return {
                ...state,
                isGameOver: true,
                winner: state[winnerKey].name,
                winIndexes: action.payload.indexes,
                [winnerKey]: {
                    ...state[winnerKey],
                    score: state[winnerKey].score + 1,
                },
            }

        case 'DECLARE_DRAW':
            return {
                ...state,
                isDraw: true,
                drawScore: state.drawScore + 1,
                isGameOver: true,
            }

        default:
            return state
    }
}

// Create Context
const TicTacToeContext = createContext()

// Context Provider
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    const setMode = (mode) => dispatch({ type: 'SET_MODE', payload: mode })
    const setPlayerNames = (playerX, playerO) => dispatch({ type: 'SET_PLAYER_NAMES', payload: { playerX, playerO } })
    const setActiveIndex = (index) => dispatch({ type: 'SET_ACTIVE_INDEX', payload: index })
    const updateBoard = (updatedBoard) => dispatch({ type: 'UPDATE_BOARD', payload: updatedBoard })
    const updateClassicBoard = (updatedBoard) => dispatch({ type: 'UPDATE_CLASSIC_BOARD', payload: updatedBoard })
    const handleMove = (macroIndex, cellIndex) => dispatch({ type: 'HANDLE_MOVE', payload: { macroIndex, cellIndex } })
    const StartOver = () => dispatch({ type: 'START_OVER' })
    const clearBoard = () => dispatch({ type: 'CLEAR_BOARD' })
    const declareWinner = (winner, indexes) => dispatch({ type: 'DECLARE_WINNER', payload: { winner, indexes } })
    const declareDraw = () => dispatch({ type: 'DECLARE_DRAW' })

    return (
        <TicTacToeContext.Provider
            value={{
                state,
                setMode,
                setPlayerNames,
                setActiveIndex,
                updateBoard,
                updateClassicBoard,
                handleMove,
                StartOver,
                clearBoard,
                declareWinner,
                declareDraw,
            }}>
            {children}
        </TicTacToeContext.Provider>
    )
}

// Custom Hook
export const useTicTacToeContext = () => {
    const context = useContext(TicTacToeContext)
    if (!context) {
        throw new Error('useTicTacToeContext must be used within a TicTacToeProvider')
    }
    return context
}
