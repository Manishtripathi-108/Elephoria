import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'

import { io } from 'socket.io-client'

import { ActionTypes } from './TicTacToeActions'
import { TicTacToeReducer, initialState } from './TicTacToeReducer'

// Context for the TicTacToe game
const TicTacToeContext = createContext()

// Provider Component
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TicTacToeReducer, initialState)
    const socketRef = useRef(null)

    // Actions
    const setMode = useCallback((mode) => dispatch({ type: ActionTypes.SET_MODE, payload: mode }), [])

    const setPlayerNames = useCallback((player, name) => dispatch({ type: ActionTypes.SET_PLAYER_NAMES, payload: { player, name } }), [])

    const handleMove = useCallback(
        (macroIndex, cellIndex = null) => {
            if (state.isPlayingOnline && socketRef.current) {
                const movePayload = {
                    roomId: state.roomId, // Identify the room
                    playerSymbol: state.playerSymbol, // Who is making the move (X or O)
                    move: { macroIndex, ...(cellIndex !== null && { cellIndex }) }, // Ultimate board requires cellIndex
                }

                // Emit the move to the server
                socketRef.current.emit('playerMove', movePayload)
            } else {
                // For offline play, directly update the state
                dispatch({ type: ActionTypes.HANDLE_MOVE, payload: { macroIndex, cellIndex } })
            }
        },
        [state.isPlayingOnline, state.roomId, state.playerSymbol]
    )

    const startOver = useCallback(() => dispatch({ type: ActionTypes.START_OVER }), [])

    const clearBoard = useCallback(() => dispatch({ type: ActionTypes.CLEAR_BOARD }), [])

    const connectPlayer = useCallback(() => {
        if (socketRef.current) return

        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        socketRef.current.on('connect', () => {
            console.log('User connected with ID:', socketRef.current.id)
            dispatch({ type: ActionTypes.IS_PLAYING_ONLINE, payload: true })
        })

        socketRef.current.on('roomFull', (roomState) => {
            console.log('Room is full:', roomState)
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { ...roomState } })
        })

        socketRef.current.on('gameStarted', () => {
            dispatch({ type: ActionTypes.UPDATE_STATE, payload: { gameStarted: true } })
        })

        socketRef.current.on('updateGame', ({ macroIndex, cellIndex }) => {
            console.log('Game updated:', moveData)
            dispatch({ type: ActionTypes.HANDLE_MOVE, payload: { macroIndex, cellIndex } })
        })

        socketRef.current.on('disconnect', () => {
            console.log('User disconnected')
            socketRef.current = null
            startOver()
            window.addToast('Disconnected from server', 'error')
        })
    }, [setPlayerNames, startOver])

    const disconnectPlayer = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect()
            socketRef.current = null
        }
    }, [])

    const startGame = useCallback(() => {
        socketRef.current.emit('startGame', { roomId: state.roomId }, ({ success, message }) => {
            success ? window.addToast('Game started...', 'success') : window.addToast(message, 'error')
        })
    }, [state.roomId])

    const joinRoom = useCallback(
        (roomId, playerName, roomName = 'default', isCreateRoom = false) => {
            if (!state.isPlayingOnline) connectPlayer()

            socketRef.current.emit('joinRoom', { roomId, playerName, roomName, isCreateRoom }, ({ success, symbol, roomState, message }) => {
                if (success) {
                    dispatch({
                        type: ActionTypes.UPDATE_STATE,
                        payload: {
                            playerSymbol: symbol,
                            ...roomState,
                        },
                    })
                } else {
                    window.addToast(message, 'error')
                    disconnectPlayer()
                }
            })
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectPlayer()
            console.log('Socket disconnected on cleanup')
        }
    }, [disconnectPlayer])

    return (
        <TicTacToeContext.Provider
            value={{
                state,
                setMode,
                setPlayerNames,
                handleMove,
                startOver,
                clearBoard,
                startGame,
                connectPlayer,
                disconnectPlayer,
                createRoom,
                joinRoom,
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
