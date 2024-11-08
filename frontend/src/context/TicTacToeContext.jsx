import React, { createContext, useContext, useReducer } from 'react'

// Initial State for both Classic and Ultimate Tic Tac Toe
const initialState = {
    mode: 'classic', // 'classic' or 'ultimate'
    isXNext: true,
    boardClassic: Array(9).fill(null), // Classic 3x3 board
    boardUltimate: Array(9).fill(Array(9).fill(null)), // Ultimate 9x9 board
    winner: null,
    isDraw: false,
    playerX: { name: 'Player 1', score: 0 },
    playerO: { name: 'Player 2', score: 0 },
}

// Game Reducer
const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MODE':
            return { ...state, mode: action.payload }

        case 'SET_PLAYER_NAMES':
            return {
                ...state,
                playerX: { ...state.playerX, name: action.payload.playerX },
                playerO: { ...state.playerO, name: action.payload.playerO },
            }

        case 'MAKE_MOVE':
            const { index, boardIndex } = action.payload
            if (state.mode === 'classic') {
                const updatedClassicBoard = [...state.boardClassic]
                updatedClassicBoard[index] = state.isXNext ? 'X' : 'O'
                return {
                    ...state,
                    boardClassic: updatedClassicBoard,
                    isXNext: !state.isXNext,
                }
            } else {
                const updatedUltimateBoard = state.boardUltimate.map((board, i) =>
                    i === boardIndex ? board.map((cell, j) => (j === index ? (state.isXNext ? 'X' : 'O') : cell)) : board
                )
                return {
                    ...state,
                    boardUltimate: updatedUltimateBoard,
                    isXNext: !state.isXNext,
                }
            }

        case 'RESET_GAME':
            return {
                ...initialState,
                mode: state.mode,
                playerX: state.playerX,
                playerO: state.playerO,
            }

        case 'SET_WINNER':
            return { ...state, winner: action.payload }

        case 'SET_DRAW':
            return { ...state, isDraw: true }

        default:
            return state
    }
}

// Create Context
const TicTacToeContext = createContext()

// Context Provider
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    // Utility Functions
    const setMode = (mode) => dispatch({ type: 'SET_MODE', payload: mode })
    const setPlayerNames = (playerX, playerO) => dispatch({ type: 'SET_PLAYER_NAMES', payload: { playerX, playerO } })
    const makeMove = (index, boardIndex = null) => dispatch({ type: 'MAKE_MOVE', payload: { index, boardIndex } })
    const resetGame = () => dispatch({ type: 'RESET_GAME' })
    const setWinner = (winner) => dispatch({ type: 'SET_WINNER', payload: winner })
    const setDraw = () => dispatch({ type: 'SET_DRAW' })

    return (
        <TicTacToeContext.Provider
            value={{
                state,
                setMode,
                setPlayerNames,
                makeMove,
                resetGame,
                setWinner,
                setDraw,
            }}>
            {children}
        </TicTacToeContext.Provider>
    )
}

// Custom Hook
export const useTicTacToeContext = () => useContext(TicTacToeContext)
