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
    roomName: null,
    gameStarted: false,

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

            const newState = {
                ...initialState,
                mode: action.payload,
                playerX: state.playerX,
                playerO: state.playerO,
            }

            if (state.isPlayingOnline) {
                newState.isPlayingOnline = state.isPlayingOnline
                newState.roomId = state.roomId
                newState.roomName = state.roomName
                newState.gameStarted = state.gameStarted
                newState.playerSymbol = state.playerSymbol
            }

            return newState

        case 'SET_PLAYER_NAMES':
            return {
                ...state,
                [action.payload.player]: { ...state[action.payload.player], name: action.payload.name },
            }

        case 'HANDLE_MOVE':
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
                ...initialState,
                mode: state.mode,
                isPlayingOnline: action.payload,
            }

        case 'JOIN_ROOM':
            return {
                ...state,
                ...action.payload,
            }

        case 'START_GAME':
            return {
                ...state,
                isXNext: true,
                gameStarted: true,
                playerX: { ...state.playerX, score: 0 },
                playerO: { ...state.playerO, score: 0 },
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
                mode: state.mode,
                drawScore: state.drawScore,
                playerX: state.playerX,
                playerO: state.playerO,
                isPlayingOnline: state.isPlayingOnline,
                roomId: state.roomId,
                roomName: state.roomName,
                gameStarted: state.gameStarted,
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
    const startGame = () => dispatch({ type: 'START_GAME' })
    const setPlayerNames = (player, name) => dispatch({ type: 'SET_PLAYER_NAMES', payload: { player, name } })
    const handleMove = (macroIndex, cellIndex) => dispatch({ type: 'HANDLE_MOVE', payload: { macroIndex, cellIndex } })
    const StartOver = () => dispatch({ type: 'START_OVER' })
    const clearBoard = () => dispatch({ type: 'CLEAR_BOARD' })

    const connectPlayer = () => {
        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        // Listen for connection and log the socket ID
        socketRef.current.on('connect', () => {
            console.log('User connected with ID:', socketRef.current.id)
            dispatch({ type: 'IS_PLAYING_ONLINE', payload: true })
        })

        socketRef.current.on('startGame', (roomState) => {
            const opponentId = Object.keys(roomState.players).find((playerId) => playerId !== socketRef.current.id)
            setPlayerNames(`player${roomState.players[opponentId].symbol}`, roomState.players[opponentId].name)
            startGame()
            console.log('Game started:', roomState)
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
            socketRef.current = null
            clearBoard()
        })
    }

    const disconnectPlayer = () => {
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
    }

    const joinRoom = (roomId, playerName, roomName = 'default') => {
        if (!state.isPlayingOnline) connectPlayer()

        socketRef.current.emit('joinRoom', { roomId, playerName, roomName }, (response) => {
            if (response.success) {
                dispatch({
                    type: 'JOIN_ROOM',
                    payload: {
                        roomId,
                        playerSymbol: response.symbol,
                        roomName: response.roomState.name,
                    },
                })

                setPlayerNames(`player${response.symbol}`, response.roomState.players[socketRef.current.id].name)
                console.log('Room joined:', response)
            } else {
                window.addToast(response.message, 'error')
                disconnectPlayer()
            }
        })
    }

    const createRoom = (roomName, playerName) => {
        if (!state.isPlayingOnline) connectPlayer()

        socketRef.current.emit('getRoomId', (response) => {
            if (response.success) {
                console.log('Room created:', response)
                joinRoom(response.roomId, playerName, roomName)
            } else {
                window.addToast(response.message, 'error')
                disconnectPlayer()
            }
        })
    }

    const handleOnlineMove = (macroIndex, cellIndex) => {
        socketRef.current.emit('move', {
            roomId: state.roomId,
            moveData: { macroIndex, cellIndex, isXNext: state.isXNext },
        })
    }

    useEffect(() => {
        // Ensure socket is cleaned up when the component unmounts
        return () => {
            disconnectPlayer()

            console.log('Socket disconnected on cleanup')
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
