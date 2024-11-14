import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'

import { io } from 'socket.io-client'

import { evaluateBoardStatus } from '../utils/TicTacToeConst'

// Initial State
const initialState = {
    // Game mode and boards
    mode: 'classic', // 'classic' or 'ultimate'
    classicBoard: Array(9).fill(null),
    ultimateBoard: Array(9).fill(Array(9).fill(null)),

    // Online play
    isPlayingOnline: false,
    playerSymbol: null,
    roomId: null,
    onlineName: null,

    // Game state
    isXNext: true,
    isGameOver: false,
    winner: null,
    winIndexes: null,
    isDraw: false,
    drawScore: 0,
    activeIndex: null,

    // Player details
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

        case 'IS_PLAYING_ONLINE':
            return {
                ...state,
                isPlayingOnline: action.payload,
            }

        case 'UPDATE_GAME':
            return {
                ...state,
                ...action.payload,
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
                isPlayingOnline: state.isPlayingOnline,
                mode: state.mode,
                drawScore: state.drawScore,
                playerX: state.playerX,
                playerO: state.playerO,
            }

        default:
            return state
    }
}

// Create Context
const TicTacToeContext = createContext()

// Context Provider
export const TicTacToeProvider = ({ children }) => {
    const socketRef = useRef(null)
    const [state, dispatch] = useReducer(gameReducer, initialState)

    const setMode = (mode) => dispatch({ type: 'SET_MODE', payload: mode })
    const setPlayerNames = (playerX, playerO) => dispatch({ type: 'SET_PLAYER_NAMES', payload: { playerX, playerO } })
    const handleMove = (macroIndex, cellIndex) => dispatch({ type: 'HANDLE_MOVE', payload: { macroIndex, cellIndex } })
    const StartOver = () => dispatch({ type: 'START_OVER' })
    const clearBoard = () => dispatch({ type: 'CLEAR_BOARD' })

    const connectPlayer = () => {
        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        // Listen for connection and log the socket ID
        socketRef.current.on('connect', () => {
            console.log('User connected with ID:', socketRef.current.id)
            dispatch({ type: 'IS_PLAYING_ONLINE', payload: true })
            clearBoard()
        })

        // Receive game updates from the server
        socketRef.current.on('updateGame', (moveData) => {
            console.log('Game updated:', moveData)
            dispatch({ type: 'UPDATE_GAME', payload: moveData })
        })

        // Listen for disconnection and log the socket ID
        socketRef.current.on('disconnect', () => {
            console.log('User disconnected')
            dispatch({ type: 'IS_PLAYING_ONLINE', payload: false })
            clearBoard()
        })
    }

    const disconnectPlayer = () => {
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
    }

    const joinRoom = (roomId, playerName, roomName = 'default') => {
        if (!state.isPlayingOnline) {
            connectPlayer()
            console.log('connect')
        }

        socketRef.current.emit('joinRoom', { roomId, playerName, roomName }, (response) => {
            if (response.success) {
                // dispatch({ type: 'JOIN_ROOM', payload: { symbol: response.symbol, roomId } })
                console.log(response)
            } else {
                window.addToast(response.message, 'error')
                disconnectPlayer()
            }
        })
    }

    const createRoom = (roomName, playerName) => {
        if (!state.isPlayingOnline) {
            connectPlayer()
            console.log('connect')
        }
        
        socketRef.current.emit('getRoomId', (response) => {
            if (response.success) {
                console.log(response)
                joinRoom(response.roomId, playerName, roomName)
            } else {
                window.addToast(response.message, 'error')
                disconnectPlayer()
            }
        })
    }

    const handleOnlineMove = (macroIndex, cellIndex) => {
        handleMove(macroIndex, cellIndex)

        socketRef.current.emit('move', {
            roomId: state.roomId,
            moveData: { macroIndex, cellIndex, isXNext: state.isXNext },
        })
    }

    useEffect(() => {
        // Ensure socket is cleaned up when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                console.log('Socket disconnected on cleanup')
            }
        }
    }, [])

    return (
        <TicTacToeContext.Provider
            value={{
                state,
                setMode,
                setPlayerNames,
                handleMove,
                StartOver,
                clearBoard,
                connectPlayer,
                disconnectPlayer,
                handleOnlineMove,
                joinRoom,
                createRoom,
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
