import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import { io } from 'socket.io-client'

import { ActionTypes } from './TicTacToeActions'
import { TicTacToeReducer, initialState } from './TicTacToeReducer'

// Create Context
const TicTacToeContext = createContext()

// Custom Hook for Context
export const useTicTacToeContext = () => {
    const context = useContext(TicTacToeContext)
    if (!context) {
        throw new Error('useTicTacToeContext must be used within a TicTacToeProvider')
    }
    return context
}

// Provider Component
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TicTacToeReducer, initialState)
    const socketRef = useRef(null)
    const navigate = useNavigate()

    // --- Utility Functions ---

    // Establish Socket Connection
    const connectPlayer = useCallback(() => {
        if (socketRef.current) return

        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        socketRef.current.on('connect', () => {
            console.log('Connected:', socketRef.current.id)
            dispatch({ type: ActionTypes.IS_PLAYING_ONLINE, payload: true })
        })

        socketRef.current.on('gameStarted', (roomState) => {
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { gameStarted: true, ...roomState } })
        })

        socketRef.current.on('updateGame', (roomState) => {
            console.log('updateGame', roomState)
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { ...roomState } })
        })

        socketRef.current.on('gameError', (message) => {
            window.addToast(message, 'error')
        })

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server')
            socketRef.current = null
            dispatch({ type: ActionTypes.START_OVER })
        })
    }, [])

    // Disconnect Player
    const disconnectPlayer = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect()
            socketRef.current = null
        }
    }, [])

    // Emit Events
    const emitEvent = useCallback((event, payload) => {
        if (socketRef.current) {
            socketRef.current.emit(event, payload)
        }
    }, [])

    // --- Actions ---

    // Set Game Mode
    const setMode = useCallback(
        (mode) => {
            if (state.mode !== mode) {
                state.isPlayingOnline ? emitEvent('setMode', { roomId: state.roomId, mode }) : dispatch({ type: ActionTypes.SET_MODE, payload: mode })
            }
        },
        [state.isPlayingOnline, state.roomId, state.mode, emitEvent]
    )

    // Set Player Names
    const setPlayerNames = useCallback((player, name) => {
        dispatch({ type: ActionTypes.SET_PLAYER_NAMES, payload: { player, name } })
    }, [])

    // Handle Player Move
    const handleMove = useCallback(
        (macroIndex, cellIndex = null) => {
            const { isPlayingOnline, isXNext, playerSymbol, roomId, classicBoard, ultimateBoard, activeIndex } = state

            // Validate Move
            if (ultimateBoard[macroIndex]?.[cellIndex] || classicBoard[macroIndex] || (activeIndex !== null && activeIndex !== macroIndex)) {
                window.addToast('Invalid move', 'error')
                return
            }

            if (isPlayingOnline) {
                const isPlayerTurn = isXNext === (playerSymbol === 'X')
                if (isPlayerTurn) {
                    emitEvent('playerMove', {
                        roomId,
                        playerSymbol,
                        macroIndex,
                        ...(cellIndex !== null && { cellIndex }),
                    })
                } else {
                    window.addToast('It is not your turn', 'error')
                }
            } else {
                dispatch({ type: ActionTypes.HANDLE_MOVE, payload: { macroIndex, cellIndex } })
            }
        },
        [state, emitEvent]
    )

    // Start Game
    const startGame = useCallback(() => {
        emitEvent('startGame', { roomId: state.roomId })
    }, [state.roomId, emitEvent])

    // Join Room
    const joinRoom = useCallback(
        (roomId, playerName, roomName = 'default', isCreateRoom = false) => {
            if (!state.isPlayingOnline) connectPlayer()
            emitEvent('joinRoom', { roomId, playerName, roomName, isCreateRoom })
        },
        [state.isPlayingOnline, connectPlayer, emitEvent]
    )

    // Create Room
    const createRoom = useCallback(
        (roomName, playerName) => {
            if (!state.isPlayingOnline) connectPlayer()

            socketRef.current.emit('getRoomId', ({ success, roomId, message }) => {
                if (success) {
                    joinRoom(roomId, playerName, roomName, true)
                } else {
                    window.addToast(message, 'error')
                }
            })
        },
        [connectPlayer, joinRoom, emitEvent]
    )

    // Leave Room
    const leaveRoom = useCallback(() => {
        emitEvent('leaveRoom', state.roomId)
    }, [state.roomId, emitEvent])

    // Clear Board
    const clearBoard = useCallback(() => {
        state.isPlayingOnline ? emitEvent('clearBoard', state.roomId) : dispatch({ type: ActionTypes.CLEAR_BOARD })
    }, [state.isPlayingOnline, state.roomId, emitEvent])

    // Start Over
    const startOver = useCallback(() => {
        dispatch({ type: ActionTypes.START_OVER })
    }, [])

    // --- Lifecycle Hooks ---

    // Cleanup on Component Unmount
    useEffect(() => {
        return () => {
            disconnectPlayer()
        }
    }, [disconnectPlayer])

    // Navigate on Game Start
    useEffect(() => {
        if (state.isPlayingOnline && state.gameStarted) {
            navigate(`/games/tic-tac-toe/${state.mode}`)
        }
    }, [state.isPlayingOnline, state.gameStarted, state.mode, navigate])

    // --- Provider ---
    return (
        <TicTacToeContext.Provider
            value={{
                setMode,
                setPlayerNames,
                handleMove,
                startGame,
                joinRoom,
                createRoom,
                leaveRoom,
                clearBoard,
                startOver,
                connectPlayer,
                disconnectPlayer,
                state,
            }}>
            {children}
        </TicTacToeContext.Provider>
    )
}
