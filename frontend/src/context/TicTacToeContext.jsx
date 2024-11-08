import React, { createContext, useContext, useReducer } from 'react'

// Utility function to create new boards
const createClassicBoard = () => Array(9).fill(null)
const createUltimateBoard = () => Array(9).fill(Array(9).fill(null))

// Initial State
const initialState = {
    mode: 'classic', // 'classic' or 'ultimate'
    isXNext: true,
    classicBoard: createClassicBoard(),
    ultimateBoard: createUltimateBoard(),
    isGameOver: false,
    winner: null,
    winIndexes: null,
    isDraw: false,
    playerX: { name: 'Player 1', score: 0 },
    playerO: { name: 'Player 2', score: 0 },
}

// Game Reducer
const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MODE':
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

        case 'UPDATE_BOARD':
            const updatedBoard = state.mode === 'classic' ? { classicBoard: action.payload } : { ultimateBoard: action.payload }
            return {
                ...state,
                ...updatedBoard,
                isXNext: !state.isXNext,
            }

        case 'RESET_GAME':
            return {
                ...initialState,
                mode: state.mode,
            }

        case 'INITIALIZE_GAME':
            return {
                ...initialState,
                mode: state.mode,
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

    // Utility Functions
    const setMode = (mode) => dispatch({ type: 'SET_MODE', payload: mode })
    const setPlayerNames = (playerX, playerO) => dispatch({ type: 'SET_PLAYER_NAMES', payload: { playerX, playerO } })
    const updateBoard = (updatedBoard) => dispatch({ type: 'UPDATE_BOARD', payload: updatedBoard })
    const resetGame = () => dispatch({ type: 'RESET_GAME' })
    const initializeGame = () => dispatch({ type: 'INITIALIZE_GAME' })
    const declareWinner = (winner, indexes) => dispatch({ type: 'DECLARE_WINNER', payload: { winner, indexes } })
    const declareDraw = () => dispatch({ type: 'DECLARE_DRAW' })

    return (
        <TicTacToeContext.Provider
            value={{
                state,
                setMode,
                setPlayerNames,
                updateBoard,
                resetGame,
                initializeGame,
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
