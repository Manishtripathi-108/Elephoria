import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'

import { io } from 'socket.io-client'

import { TicTacToeReducer, initialState } from './TicTacToeReducer'

// Context for the TicTacToe game
const TicTacToeContext = createContext()

// Provider Component
export const TicTacToeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(TicTacToeReducer, initialState)
    const socketRef = useRef(null)

    // Actions
    const setMode = useCallback((mode) => {
        dispatch({ type: 'SET_MODE', payload: mode })
    }, [])

    const setPlayerNames = useCallback((player, name) => {
        dispatch({ type: 'SET_PLAYER_NAMES', payload: { player, name } })
    }, [])

    const handleMove = useCallback((macroIndex, cellIndex) => {
        dispatch({ type: 'HANDLE_MOVE', payload: { macroIndex, cellIndex } })
    }, [])

    const startOver = useCallback(() => {
        dispatch({ type: 'START_OVER' })
    }, [])

    const clearBoard = useCallback(() => {
        dispatch({ type: 'CLEAR_BOARD' })
    }, [])

    const connectPlayer = useCallback(() => {
        if (socketRef.current) return

        socketRef.current = io(import.meta.env.VITE_SERVER_URL)

        socketRef.current.on('connect', () => {
            console.log('User connected with ID:', socketRef.current.id)
            dispatch({ type: 'IS_PLAYING_ONLINE', payload: true })
        })

        socketRef.current.on('roomFull', (roomState) => {
            console.log('Room is full:', roomState)

            const opponentId = Object.keys(roomState.players).find((id) => id !== socketRef.current.id)

            if (opponentId) {
                setPlayerNames(`player${roomState.players[opponentId].symbol}`, roomState.players[opponentId].name)
            }
        })

        socketRef.current.on('gameStarted', () => {
            dispatch({ type: 'START_GAME' })
        })

        socketRef.current.on('updateGame', (moveData) => {
            console.log('Game updated:', moveData)
            dispatch({ type: 'UPDATE_GAME', payload: moveData })
        })

        socketRef.current.on('disconnect', () => {
            console.log('User disconnected')
            socketRef.current = null
            startOver()
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
            if (success) {
                dispatch({ type: 'START_GAME' })
            } else {
                window.addToast(message, 'error')
            }
        })
    }, [state.roomId])

    const joinRoom = useCallback(
        (roomId, playerName, roomName = 'default', isCreateRoom = false) => {
            if (!state.isPlayingOnline) connectPlayer()

            socketRef.current.emit('joinRoom', { roomId, playerName, roomName, isCreateRoom }, ({ success, symbol, roomState, message }) => {
                if (success) {
                    const opponentId = Object.keys(roomState.players).find((id) => id !== socketRef.current.id)

                    dispatch({
                        type: 'JOIN_ROOM',
                        payload: {
                            roomId,
                            symbol,
                            roomName: roomState.name,
                            playerName: roomState.players[socketRef.current.id].name,
                            opponentName: opponentId ? roomState.players[opponentId].name : null,
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

    const updateGameState = useCallback(
        (macroIndex, cellIndex) => {
            socketRef.current.emit('move', {
                roomId: state.roomId,
                moveData: { macroIndex, cellIndex, isXNext: state.isXNext },
            })
        },
        [state.roomId, state.isXNext]
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
                updateGameState,
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
