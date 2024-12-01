import { evaluateBoardStatus } from '../../pages/games/tic-tac-toe/constants'
import { ActionTypes } from './TicTacToeActions'

// Initial State
export const initialState = {
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

// Utility to create new scores for a winner
const updateScore = (state, winner) => {
    if (!winner) return state
    const playerKey = winner === 'X' ? 'playerX' : 'playerO'
    return {
        ...state,
        [playerKey]: {
            ...state[playerKey],
            score: state[playerKey].score + 1,
        },
    }
}

// Utility to reset game but retain necessary properties
const resetState = (state, overrides = {}) => ({
    ...initialState,
    mode: state.mode,
    roomId: state.roomId,
    roomName: state.roomName,
    playerSymbol: state.playerSymbol,
    isPlayingOnline: state.isPlayingOnline,
    gameStarted: state.gameStarted,
    drawScore: state.drawScore,
    playerX: state.playerX,
    playerO: state.playerO,
    ...overrides,
})

export const TicTacToeReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_MODE: {
            const { payload: mode } = action
            if (!['classic', 'ultimate'].includes(mode)) {
                console.error('Invalid game mode:', mode)
                return state
            }
            return resetState(state, { mode })
        }

        case ActionTypes.SET_PLAYER_NAMES:
            return {
                ...state,
                [action.payload.player]: { ...state[action.payload.player], name: action.payload.name },
            }

        case ActionTypes.HANDLE_MOVE: {
            const { payload } = action
            const { mode, isXNext, isGameOver, classicBoard, ultimateBoard, activeIndex } = state

            if (isGameOver || classicBoard[payload.macroIndex]) return state

            if (mode === 'classic') {
                const { macroIndex } = payload

                const updatedBoard = classicBoard.map((cell, i) => (i === macroIndex ? (isXNext ? 'X' : 'O') : cell))
                const result = evaluateBoardStatus(updatedBoard)

                let newState = {
                    ...state,
                    classicBoard: updatedBoard,
                    isXNext: !isXNext,
                    isGameOver: result.status !== 'continue',
                    winner: result.status === 'win' ? state[`player${result.winner}`].name : null,
                    winIndexes: result.status === 'win' ? result.line : null,
                    isDraw: result.status === 'draw',
                }

                newState = updateScore(newState, result.winner)
                if (result.status === 'draw') newState.drawScore += 1

                return newState
            } else {
                const { macroIndex, cellIndex } = payload
                if (ultimateBoard[macroIndex][cellIndex] || (activeIndex !== null && activeIndex !== macroIndex)) return state

                const updatedUltimateBoard = ultimateBoard.map((board, i) =>
                    i === macroIndex ? board.map((cell, j) => (j === cellIndex ? (isXNext ? 'X' : 'O') : cell)) : board
                )

                const miniResult = evaluateBoardStatus(updatedUltimateBoard[macroIndex])
                const updatedClassicBoard = [...classicBoard]
                if (miniResult.status === 'win') updatedClassicBoard[macroIndex] = miniResult.winner
                else if (miniResult.status === 'draw') updatedClassicBoard[macroIndex] = 'D'

                const largeResult = evaluateBoardStatus(updatedClassicBoard)

                let newState = {
                    ...state,
                    ultimateBoard: updatedUltimateBoard,
                    classicBoard: updatedClassicBoard,
                    isXNext: !isXNext,
                    isGameOver: largeResult.status !== 'continue',
                    winner: largeResult.status === 'win' ? state[`player${largeResult.winner}`].name : null,
                    winIndexes: largeResult.status === 'win' ? largeResult.line : null,
                    isDraw: largeResult.status === 'draw',
                    activeIndex: updatedClassicBoard[cellIndex] ? null : cellIndex,
                }

                newState = updateScore(newState, largeResult.winner)
                if (largeResult.status === 'draw') newState.drawScore += 1

                return newState
            }
        }

        case ActionTypes.IS_PLAYING_ONLINE:
            return resetState(initialState, { isPlayingOnline: action.payload })

        case ActionTypes.UPDATE_STATE:
            return {
                ...state,
                ...action.payload,
            }

        case ActionTypes.START_OVER:
            return {
                ...initialState,
                mode: state.mode,
            }

        case ActionTypes.CLEAR_BOARD:
            return resetState(state, { isXNext: Math.random() < 0.5 })

        default:
            return state
    }
}
