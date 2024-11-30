const { backendLogger } = require("../utils/logger");

const WINNING_PATTERNS = {
	9: [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	],
	16: [
		[0, 1, 2, 3],
		[4, 5, 6, 7],
		[8, 9, 10, 11],
		[12, 13, 14, 15],
		[0, 4, 8, 12],
		[1, 5, 9, 13],
		[2, 6, 10, 14],
		[3, 7, 11, 15],
		[0, 5, 10, 15],
		[3, 6, 9, 12],
	],
	25: [
		[0, 1, 2, 3, 4],
		[5, 6, 7, 8, 9],
		[10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24],
		[0, 5, 10, 15, 20],
		[1, 6, 11, 16, 21],
		[2, 7, 12, 17, 22],
		[3, 8, 13, 18, 23],
		[4, 9, 14, 19, 24],
		[0, 6, 12, 18, 24],
		[4, 8, 12, 16, 20],
	],
};

const evaluateBoardStatus = (board) => {
	for (const [a, b, c] of WINNING_PATTERNS[9]) {
		if (board[a] === "D") continue;

		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return { status: "win", winner: board[a], line: [a, b, c] };
		}
	}
	const isBoardFull = board.every((cell) => cell);
	if (isBoardFull) return { status: "draw" };
	return { status: "continue" };
};

// Utility to create new scores for a winner
const updateScore = (state, winner) => {
	if (!winner) return state;
	const playerKey = winner === "X" ? "playerX" : "playerO";
	return {
		...state,
		[playerKey]: {
			...state[playerKey],
			score: state[playerKey].score + 1,
		},
	};
};

// Utility to reset game but retain necessary properties
const resetState = (state, overrides = {}) => ({
	...initialRoom,
	mode: state.mode,
	roomId: state.roomId,
	roomName: state.roomName,
	drawScore: state.drawScore,
	playerX: state.playerX,
	playerO: state.playerO,
	...overrides,
});

const rooms = {};

const initialRoom = {
	// Game mode and boards
	mode: "classic", // 'classic' or 'ultimate'
	classicBoard: Array(9).fill(null),
	ultimateBoard: Array(9).fill(Array(9).fill(null)),

	// Online play
	roomId: null,
	roomName: null,

	// Game state
	isXNext: true,
	isGameOver: false,
	winner: null,
	winIndexes: null,
	isDraw: false,
	drawScore: 0,
	activeIndex: null,

	// Player details
	playerX: { id: null, name: null, score: 0 },
	playerO: { id: null, name: null, score: 0 },
};

const generateRoomId = () => {
	do {
		roomId = Math.random().toString(36).substring(2, 8);
	} while (Object.keys(rooms).includes(roomId));

	return roomId;
};

const joinRoom = (roomId, playerName, roomName, isCreateRoom, socketId) => {
	let room = rooms[roomId];

	if (!room) {
		if (!isCreateRoom)
			return { success: false, message: "Room Does Not Exist" };

		room = { ...initialRoom, roomId, roomName };
		rooms[roomId] = room;
	}

	if (room.playerX.id === socketId || room.playerO.id === socketId) {
		return {
			success: true,
			symbol: room.playerX.id === socketId ? "X" : "O",
			roomState: room,
		};
	}

	// If both players have already joined the room, don't allow another player to join.
	if (room.playerX.id && room.playerO.id) {
		return {
			success: false,
			message: "Room is already full. Please try another room.",
		};
	}

	const playerSymbol = room.playerX.id ? "O" : "X";

	room[`player${playerSymbol}`] = {
		id: socketId,
		name: playerName,
		score: 0,
	};

	return {
		success: true,
		symbol: playerSymbol,
		roomState: room,
		isRoomFull: room.playerX.id && room.playerO.id,
	};
};

const startGame = (roomId) => {
	const room = rooms[roomId];

	if (room && room.playerX.id && room.playerO.id) {
		return { success: true, roomState: room };
	}

	return {
		success: false,
		message: room ? "Players not found" : "Room does not exist",
	};
};

const updateGameState = (movePayload) => {
	const { roomId, playerSymbol, macroIndex, cellIndex } = movePayload;
	const state = rooms[roomId];

	if (!state) return { success: false, message: "Room does not exist" };

	const {
		mode,
		isXNext,
		isGameOver,
		classicBoard,
		ultimateBoard,
		activeIndex,
	} = state;

	if (
		isGameOver ||
		classicBoard[macroIndex] ||
		isXNext !== (playerSymbol === "X")
	)
		return { success: false, message: "Invalid move" };

	if (mode === "classic") {
		const updatedBoard = classicBoard.map((cell, i) =>
			i === macroIndex ? (isXNext ? "X" : "O") : cell
		);
		const result = evaluateBoardStatus(updatedBoard);

		let newState = {
			...state,
			classicBoard: updatedBoard,
			isXNext: !isXNext,
			isGameOver: result.status !== "continue",
			winner:
				result.status === "win"
					? state[`player${result.winner}`].name
					: null,
			winIndexes: result.status === "win" ? result.line : null,
			isDraw: result.status === "draw",
		};

		newState = updateScore(newState, result.winner);
		if (result.status === "draw") newState.drawScore += 1;

		rooms[roomId] = newState;

		return { success: true, roomState: newState };
	} else {
		if (
			ultimateBoard[macroIndex][cellIndex] ||
			(activeIndex !== null && activeIndex !== macroIndex) ||
			isXNext !== (playerSymbol === "X")
		)
			return { success: false, message: "Invalid move" };

		const updatedUltimateBoard = ultimateBoard.map((board, i) =>
			i === macroIndex
				? board.map((cell, j) =>
						j === cellIndex ? (isXNext ? "X" : "O") : cell
				  )
				: board
		);

		const miniResult = evaluateBoardStatus(
			updatedUltimateBoard[macroIndex]
		);
		const updatedClassicBoard = [...classicBoard];
		if (miniResult.status === "win")
			updatedClassicBoard[macroIndex] = miniResult.winner;
		else if (miniResult.status === "draw")
			updatedClassicBoard[macroIndex] = "D";

		const largeResult = evaluateBoardStatus(updatedClassicBoard);

		let newState = {
			...state,
			ultimateBoard: updatedUltimateBoard,
			classicBoard: updatedClassicBoard,
			isXNext: !isXNext,
			isGameOver: largeResult.status !== "continue",
			winner: largeResult.status === "win" ? largeResult.winner : null,
			winIndexes: largeResult.status === "win" ? largeResult.line : null,
			isDraw: largeResult.status === "draw",
			activeIndex: updatedClassicBoard[cellIndex] ? null : cellIndex,
		};

		newState = updateScore(newState, largeResult.winner);
		if (largeResult.status === "draw") newState.drawScore += 1;

		rooms[roomId] = newState;
		return { success: true, roomState: newState };
	}
};

/**
 * Resets the room state to the given mode (classic or ultimate)
 *
 * @param {string} roomId - Room ID
 * @param {string} mode - Mode to change to (classic or ultimate)
 * @returns {object} - Success status and the new room state if successful
 */
const changeMode = (roomId, mode) => {
	const state = rooms[roomId];
	if (!state) return { success: false, message: "Room does not exist" };
	const newState = resetState(state, { mode });
	rooms[roomId] = newState;
	return { success: true, roomState: newState };
};

/**
 * Resets the board of the given room to its initial state
 *
 * @param {string} roomId - Room ID
 * @returns {object} - Success status and the new room state if successful
 */
const clearBoard = (roomId) => {
	if (!rooms[roomId])
		return { success: false, message: "Room does not exist" };

	const newState = resetState(rooms[roomId], {
		isXNext: Math.random() < 0.5,
	});
	rooms[roomId] = newState;
	return { success: true, roomState: newState };
};

const handleDisconnect = (socketId) => {
	for (const roomId in rooms) {
		const room = rooms[roomId];
		if (room.players[socketId]) {
			delete room.players[socketId];
			return roomId;
		}
	}
	return null;
};

const leaveRoom = (roomId, socketId) => {
	const room = rooms[roomId];
	if (!room) return { success: false, message: "Room does not exist" };

	if (room.playerX.id === socketId || room.playerO.id === socketId) {
		if (room.playerX.id === socketId) {
			room.playerX = { id: null, name: null, score: 0 };
			return { success: true };
		}

		if (room.playerO.id === socketId) {
			room.playerO = { id: null, name: null, score: 0 };
			return { success: true };
		}

		// If both players have left the room, delete the room
		if (!room.playerX.id && !room.playerO.id) delete rooms[roomId];
	}

	return { success: false, message: "Player not found" };
};

module.exports = {
	generateRoomId,
	joinRoom,
	startGame,
	changeMode,
	leaveRoom,
	updateGameState,
	handleDisconnect,
	clearBoard,
};
