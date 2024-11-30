const {
	generateRoomId,
	joinRoom,
	startGame,
	changeMode,
	leaveRoom,
	updateGameState,
	playerDisconnect,
	clearBoard,
} = require("../services/gameService.js");
const { frontendLogger } = require("../utils/logger.js");

const getRoomId = (socket, io) => (callback) =>
	generateRoomId()
		? callback({ success: true, roomId })
		: callback({ success: false, message: "Unable to create room." });

const handleJoinRoom =
	(socket, io) =>
	({ roomId, playerName, roomName, isCreateRoom }, callback) => {
		const result = joinRoom(
			roomId,
			playerName,
			roomName,
			isCreateRoom,
			socket.id
		);

		if (result.success) {
			socket.join(roomId);

			// Notify both players the game if room is full
			if (result.isRoomFull) {
				io.to(roomId).emit("roomFull", result.roomState);
			}
		}

		callback(result);
	};

// handle start Game
const handleStartGame =
	(socket, io) =>
	({ roomId }, callback) => {
		const result = startGame(roomId);
		if (result.success) {
			io.to(roomId).emit("gameStarted", result.roomState);
		}
		callback(result);
	};

const handleMove = (socket, io) => (movePayload) => {
	const result = updateGameState(movePayload);

	const event = result.success ? "updateGame" : "gameError";
	io.to(roomId).emit(
		event,
		result.success
			? result.roomState
			: result.message || "Unable to update game state"
	);
};

const handleModeChange =
	(socket, io) =>
	({ roomId, mode }) => {
		const result = changeMode(roomId, mode);
		const event = result.success ? "updateGame" : "gameError";
		io.to(roomId).emit(
			event,
			result.success ? result.roomState : result.message
		);
	};

const handleClearBoard = (socket, io) => (roomId) => {
	const result = clearBoard(roomId);
	const event = result.success ? "updateGame" : "gameError";
	io.to(roomId).emit(
		event,
		result.success ? result.roomState : result.message
	);
};

const handleDisconnect = (socket, io) => () => {
	const roomId = playerDisconnect(socket.id);
	if (roomId) {
		io.to(roomId).emit("playerDisconnected", { socketId: socket.id });
	}
};

const handleLeaveRoom = (socket, io) => (roomId) => {
	const result = leaveRoom(roomId, socket.id);
	result.success
		? socket.leave(roomId)
		: socket.emit(socket.id).emit("gameError", "Unable to leave room");
	frontendLogger.info(`Player left room: ${roomId}`);
};

module.exports = {
	getRoomId,
	handleClearBoard,
	handleDisconnect,
	handleJoinRoom,
	handleLeaveRoom,
	handleModeChange,
	handleMove,
	handleStartGame,
};
