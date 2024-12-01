import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import { io } from 'socket.io-client'

import { ActionTypes } from './TicTacToeActions'
import { TicTacToeReducer, initialState } from './TicTacToeReducer'

// Context for the TicTacToe game
const TicTacToeContext = createContext()

// Provider Component
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TicTacToeReducer, initialState)
    const socketRef = useRef(null)
    const navigate = useNavigate()

    // Actions
    const setMode = useCallback(
        (mode) => {
            if (state.mode !== mode) {
                state.isPlayingOnline && socketRef.current
                    ? socketRef.current.emit('setMode', { roomId: state.roomId, mode })
                    : dispatch({ type: ActionTypes.SET_MODE, payload: mode })
            }
        },
        [state.isPlayingOnline, state.roomId, state.mode]
    )

    const setPlayerNames = useCallback((player, name) => dispatch({ type: ActionTypes.SET_PLAYER_NAMES, payload: { player, name } }), [])

    const handleMove = useCallback(
        (macroIndex, cellIndex = null) => {
            const { isPlayingOnline, isXNext, playerSymbol, roomId, classicBoard, ultimateBoard, activeIndex } = state

            // Common validation for both online and offline modes
            if (ultimateBoard[macroIndex]?.[cellIndex] || classicBoard[macroIndex] || (activeIndex !== null && activeIndex !== macroIndex)) {
                window.addToast('Invalid move', 'error')
                return
            }

            if (isPlayingOnline && socketRef.current) {
                const isPlayerTurn = isXNext === (playerSymbol === 'X')

                if (isPlayerTurn) {
                    // Emit move to server
                    const movePayload = {
                        roomId,
                        playerSymbol,
                        macroIndex,
                        ...(cellIndex !== null && { cellIndex }),
                    }

                    socketRef.current.emit('playerMove', movePayload)
                } else {
                    window.addToast('It is not your turn', 'error')
                }
            } else {
                // Dispatch local move for offline play
                dispatch({ type: ActionTypes.HANDLE_MOVE, payload: { macroIndex, cellIndex } })
            }
        },
        [state, dispatch]
    )

    const startOver = useCallback(() => dispatch({ type: ActionTypes.START_OVER }), [])

    const clearBoard = useCallback(() => {
        state.isPlayingOnline && socketRef.current ? socketRef.current.emit('clearBoard', state.roomId) : dispatch({ type: ActionTypes.CLEAR_BOARD })
    }, [state.isPlayingOnline, state.roomId])

    const connectPlayer = useCallback(() => {
        if (socketRef.current) return

        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        socketRef.current.on('connect', () => {
            console.log('User connected with ID:', socketRef.current.id)
            dispatch({ type: ActionTypes.IS_PLAYING_ONLINE, payload: true })
        })

        socketRef.current.on('gameStarted', (roomState) => {
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { gameStarted: true, ...roomState } })
        })

        socketRef.current.on('updateGame', (roomState) => {
            console.log('Game updated:', roomState)
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { ...roomState } })
        })

        socketRef.current.on('disconnect', () => {
            console.log('User disconnected')
            socketRef.current = null
            startOver()
        })

        socketRef.current.on('roomLeft', () => {
            disconnectPlayer()
            window.addToast('Room left', 'error')
        })

        socketRef.current.on('gameError', (message) => {
            console.log('Game error:', message)
            window.addToast(message, 'error')
        })
    }, [setPlayerNames, startOver])

    const disconnectPlayer = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
    }, [])

    const startGame = useCallback(() => {
        socketRef.current.emit('startGame', { roomId: state.roomId })
    }, [state.roomId])

    const joinRoom = useCallback(
        (roomId, playerName, roomName = 'default', isCreateRoom = false) => {
            if (!state.isPlayingOnline) connectPlayer()

            socketRef.current.emit('joinRoom', { roomId, playerName, roomName, isCreateRoom })
        },

        [state.isPlayingOnline, connectPlayer, disconnectPlayer]
    )

    const createRoom = useCallback(
        (roomName, playerName) => {
            if (!state.isPlayingOnline) connectPlayer()

            socketRef.current.emit('getRoomId', ({ success, roomId, message }) => {
                if (success) {
                    joinRoom(roomId, playerName, roomName, true)
                } else {
                    window.addToast(message, 'error')
                    disconnectPlayer()
                }
            })
        },
        [connectPlayer, joinRoom, disconnectPlayer]
    )

    const leaveRoom = useCallback(() => {
        if (socketRef.current) socketRef.current.emit('leaveRoom', state.roomId)
    }, [state.roomId])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectPlayer()
            console.log('Socket disconnected on cleanup')
        }
    }, [disconnectPlayer])

    useEffect(() => {
        navigate(`/games/tic-tac-toe/${state.mode}`)
    }, [state.mode])

    return (
        <TicTacToeContext.Provider
            value={{
                clearBoard,
                connectPlayer,
                createRoom,
                disconnectPlayer,
                handleMove,
                joinRoom,
                leaveRoom,
                setMode,
                setPlayerNames,
                startGame,
                startOver,
                state,
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
