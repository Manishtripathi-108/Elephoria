import { backendLogger } from "../utils/logger.js";
import { evaluateBoardStatus, initialRoom } from "../utils/ticTacToeUtils.js";

const rooms = {};

const generateRoomId = () => {
	let roomId;
	do {
		roomId = Math.random().toString(36).substring(2, 8);
	} while (rooms[roomId]);
	return roomId;
};

const joinRoom = (roomId, playerName, roomName, isCreateRoom, socketId) => {
	let room = rooms[roomId];
	// backendLogger.info(
	// 	`Joining Room: ${roomId}, ${playerName}, ${roomName}, ${isCreateRoom}`
	// );

	if (!room) {
		if (!isCreateRoom) {
			// backendLogger.warn(`Room ${roomId} does not exist.`);
			return { success: false, message: "Room does not exist" };
		}

		// Create a deep copy of initialRoom
		room = { ...JSON.parse(JSON.stringify(initialRoom)), roomId, roomName };
		rooms[roomId] = room;
		// backendLogger.info(`Room ${roomId} created.`, { room });
	}

	if (room.playerX.id === socketId || room.playerO.id === socketId) {
		return {
			success: true,
			symbol: room.playerX.id === socketId ? "X" : "O",
			roomState: room,
		};
	}

	if (room.playerX.id && room.playerO.id) {
		// backendLogger.warn(`Room ${roomId} is already full.`);
		return { success: false, message: "Room is already full." };
	}

	const symbol = room.playerX.id ? "O" : "X";
	room[`player${symbol}`] = { id: socketId, name: playerName, score: 0 };

	// backendLogger.info(
	// 	`Player ${playerName} joined Room ${roomId} as ${symbol}.`,
	// 	{ room }
	// );
	return {
		success: true,
		symbol,
		roomState: room,
		isRoomFull: !!(room.playerX.id && room.playerO.id),
	};
};

const startGame = (roomId) => {
	// backendLogger.info(`Starting game in Room ${roomId}.`);
	const room = rooms[roomId];
	if (!room || !room.playerX.id || !room.playerO.id) {
		const message = room ? "Players not found" : "Room does not exist";
		// backendLogger.warn(`Cannot start game in Room ${roomId}: ${message}`);
		return { success: false, message };
	}
	room.gameStarted = true;
	// backendLogger.info(`Game started in Room ${roomId}.`);
	return { success: true, roomState: room };
};

const updateGameState = (movePayload) => {
	const { roomId, playerSymbol, macroIndex, cellIndex } = movePayload;
	const room = rooms[roomId];

	if (!room) {
		// backendLogger.warn(`Room ${roomId} does not exist from updateGameState.`);
		return { success: false, message: "Room does not exist" };
	}

	const {
		mode,
		isXNext,
		classicBoard,
		ultimateBoard,
		isGameOver,
		activeIndex,
	} = room;

	if (
		isGameOver ||
		classicBoard[macroIndex] ||
		(mode === "ultimate" && ultimateBoard[macroIndex][cellIndex]) ||
		(activeIndex !== null && activeIndex !== macroIndex)
	) {
		// backendLogger.warn(`Invalid move in Room ${roomId}.`, { movePayload });
		return { success: false, message: "Invalid move" };
	}

	if (isXNext !== (playerSymbol === "X")) {
		// backendLogger.warn(`Not ${playerSymbol}'s turn in Room ${roomId}.`);
		return { success: false, message: "Not your turn" };
	}

	if (mode === "classic") {
		const updatedBoard = classicBoard.map((cell, i) =>
			i === macroIndex ? playerSymbol : cell
		);
		const result = evaluateBoardStatus(updatedBoard);

		Object.assign(room, {
			classicBoard: updatedBoard,
			isXNext: !isXNext,
			isGameOver: result.status !== "continue",
			winner:
				result.status === "win"
					? room[`player${result.winner}`].name
					: null,
			winIndexes: result.status === "win" ? result.line : null,
			isDraw: result.status === "draw",
		});

		if (result.status === "win") room[`player${playerSymbol}`].score++;
		if (result.status === "draw") room.drawScore++;

		// backendLogger.info(`Classic board updated in Room ${roomId}.`, {
		// 	room,
		// });
		return { success: true, roomState: room };
	} else if (mode === "ultimate") {
		const updatedUltimateBoard = ultimateBoard.map((macro, i) =>
			i === macroIndex
				? macro.map((cell, j) =>
						j === cellIndex ? playerSymbol : cell
				  )
				: macro
		);

		const miniBoardStatus = evaluateBoardStatus(
			updatedUltimateBoard[macroIndex]
		);
		if (miniBoardStatus.status === "win")
			classicBoard[macroIndex] = miniBoardStatus.winner;
		else if (miniBoardStatus.status === "draw")
			classicBoard[macroIndex] = "D";

		const largeBoardStatus = evaluateBoardStatus(classicBoard);

		Object.assign(room, {
			ultimateBoard: updatedUltimateBoard,
			classicBoard: classicBoard,
			isXNext: !isXNext,
			isGameOver: largeBoardStatus.status !== "continue",
			winner:
				largeBoardStatus.status === "win"
					? room[`player${largeBoardStatus.winner}`].name
					: null,
			winIndexes:
				largeBoardStatus.status === "win"
					? largeBoardStatus.line
					: null,
			isDraw: largeBoardStatus.status === "draw",
			activeIndex:
				largeBoardStatus.status === "continue" &&
				!classicBoard[cellIndex]
					? cellIndex
					: null,
		});

		if (largeBoardStatus.status === "win")
			room[`player${largeBoardStatus.winner}`].score++;
		if (largeBoardStatus.status === "draw") room.drawScore++;

		// backendLogger.info(`Ultimate board updated in Room ${roomId}.`, {
		// 	room,
		// });
		return { success: true, roomState: room };
	}
};

const changeBoard = (roomId, mode) => {
	const room = rooms[roomId];
	if (!room) {
		// backendLogger.warn(`Room ${roomId} does not exist from changeBoard.`);
		return { success: false, message: "Room does not exist" };
	}

	Object.assign(room, {
		...JSON.parse(JSON.stringify(initialRoom)),
		mode,
		gameStarted: room.gameStarted,
		roomId: room.roomId,
		roomName: room.roomName,
		playerX: room.playerX,
		playerO: room.playerO,
		drawScore: room.drawScore,
	});

	// backendLogger.info(`Mode changed to ${mode} in Room ${roomId}.`, { room });
	return { success: true, roomState: room };
};

const clearBoard = (roomId) => {
	console.log(roomId);

	const room = rooms[roomId];
	if (!room) {
		// backendLogger.warn(`Room ${roomId} does not exist from clearBoard.`);
		return { success: false, message: "Room does not exist" };
	}

	Object.assign(room, {
		...JSON.parse(JSON.stringify(initialRoom)),
		mode: room.mode,
		isXNext: Math.random() < 0.5,
		gameStarted: room.gameStarted,
		roomId: room.roomId,
		roomName: room.roomName,
		playerX: room.playerX,
		playerO: room.playerO,
		drawScore: room.drawScore,
	});

	// backendLogger.info(`Board cleared in Room ${roomId}.`, { room });
	return { success: true, roomState: room };
};

const leaveRoom = (roomId, socketId) => {
	const room = rooms[roomId];
	if (!room) {
		// backendLogger.warn(`Room ${roomId} does not exist. from leaveRoom`);
		return { success: false, message: "Room does not exist" };
	}

	if (room.playerX.id === socketId)
		room.playerX = { id: null, name: null, score: 0 };
	else if (room.playerO.id === socketId)
		room.playerO = { id: null, name: null, score: 0 };
	room.gameStarted = false;

	if (!room.playerX.id && !room.playerO.id) {
		delete rooms[roomId];
		// backendLogger.info(`Room ${roomId} deleted as all players left.`);
		return { success: true };
	}

	// backendLogger.info(`Player left Room ${roomId}.`);

	return { success: true, roomState: clearBoard(roomId).roomState };
};

export {
	generateRoomId,
	joinRoom,
	startGame,
	updateGameState,
	changeBoard,
	leaveRoom,
	clearBoard,
};
