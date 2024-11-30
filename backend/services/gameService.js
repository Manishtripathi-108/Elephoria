const { backendLogger } = require("../utils/logger");

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

const updateGameState = (roomId, moveData) => {
	const room = rooms[roomId];
	if (room) {
		room.gameState = moveData;
		return room;
	}
	return null;
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

const handleMove = (macroIndex, cellIndex) => {
	const { payload } = action;
	const {
		mode,
		isXNext,
		isGameOver,
		classicBoard,
		ultimateBoard,
		activeIndex,
	} = state;

	if (isGameOver || classicBoard[payload.macroIndex]) return state;

	if (mode === "classic") {
		const { macroIndex } = payload;

		const updatedBoard = classicBoard.map((cell, i) =>
			i === macroIndex ? (isXNext ? "X" : "O") : cell
		);
		const result = evaluateBoardStatus(updatedBoard);

		let newState = {
			...state,
			classicBoard: updatedBoard,
			isXNext: !isXNext,
			isGameOver: result.status !== "continue",
			winner: result.status === "win" ? result.winner : null,
			winIndexes: result.status === "win" ? result.line : null,
			isDraw: result.status === "draw",
		};

		newState = updateScore(newState, result.winner);
		if (result.status === "draw") newState.drawScore += 1;

		return newState;
	} else {
		const { macroIndex, cellIndex } = payload;
		if (
			ultimateBoard[macroIndex][cellIndex] ||
			(activeIndex !== null && activeIndex !== macroIndex)
		)
			return state;

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

		return newState;
	}
};

module.exports = {
	generateRoomId,
	joinRoom,
	startGame,
	updateGameState,
	handleDisconnect,
};
