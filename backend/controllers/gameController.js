const {
	generateRoomId,
	joinRoom,
	startGame,
	changeMode,
	leaveRoom,
	updateGameState,
	clearBoard,
} = require("../services/gameService.js");
const { frontendLogger } = require("../utils/logger.js");

const getRoomId = (socket) => (callback) => {
	const roomId = generateRoomId();
	callback(
		roomId
			? { success: true, roomId }
			: { success: false, message: "Unable to create room." }
	);
};

const handleJoinRoom =
	(socket, io) =>
	({ roomId, playerName, roomName, isCreateRoom }) => {
		const result = joinRoom(
			roomId,
			playerName,
			roomName,
			isCreateRoom,
			socket.id
		);

		if (result.success) {
			socket.join(roomId);

			// Notify the player who joined the room
			socket.emit("updateGame", {
				playerSymbol: result.symbol,
				isPlayingOnline: true,
				...result.roomState,
			});

			// Notify players if the room becomes full
			if (result.isRoomFull) {
				io.to(roomId).emit("updateGame", result.roomState);
			}
		} else {
			socket.emit(
				"gameError",
				result.message || "Unable to join the room."
			);

			socket.emit("updateGame", { isPlayingOnline: false });

			frontendLogger.warn(`Unable to join room: ${roomId}:`, {
				message: result.message || "Unable to join the room.",
			});
		}
	};

const handleStartGame =
	(socket, io) =>
	({ roomId }) => {
		const result = startGame(roomId);

		if (result.success) {
			io.to(roomId).emit("updateGame", result.roomState);
		} else {
			socket.emit(
				"gameError",
				result.message || "Unable to start the game."
			);
		}
	};

const handleMove = (socket, io) => (movePayload) => {
	const result = updateGameState(movePayload);

	if (result.success) {
		io.to(movePayload.roomId).emit("updateGame", result.roomState);
	} else {
		socket.emit("gameError", result.message || "Invalid move.");
	}
};

const handleModeChange =
	(socket, io) =>
	({ roomId, mode }) => {
		const result = changeMode(roomId, mode);

		if (result.success) {
			io.to(roomId).emit("updateGame", result.roomState);
		} else {
			socket.emit(
				"gameError",
				result.message || "Unable to change game mode."
			);
		}
	};

const handleClearBoard = (socket, io) => (roomId) => {
	const result = clearBoard(roomId);

	if (result.success) {
		io.to(roomId).emit("updateGame", result.roomState);
	} else {
		// Send error only to the requesting player
		socket.emit(
			"gameError",
			result.message || "Unable to clear the board."
		);
	}
};

const handleDisconnect = (socket, io) => () => {
	// const roomId = playerDisconnect(socket.id);
	// if (roomId) {
	// 	io.to(roomId).emit("playerDisconnected", { socketId: socket.id });
	// 	frontendLogger.info(
	// 		`Player disconnected: ${socket.id}, room: ${roomId}`
	// 	);
	// }
};

const handleLeaveRoom = (socket, io) => (roomId) => {
	const result = leaveRoom(roomId, socket.id);
	if (result.success) {
		socket.leave(roomId);
		result.roomState
			? io.to(roomId).emit("updateGame", result.roomState)
			: null;
		socket.emit("roomLeft");
		frontendLogger.info(`Player left room: ${roomId}`);
	} else {
		// Send error only to the player trying to leave
		socket.emit("gameError", result.message || "Unable to leave room.");
		frontendLogger.warn(`Unable to leave room: ${roomId}:`, {
			message: result.message || "Unable to leave room.",
		});
	}
};

module.exports = {
	getRoomId,
	handleJoinRoom,
	handleStartGame,
	handleMove,
	handleModeChange,
	handleClearBoard,
	handleDisconnect,
	handleLeaveRoom,
};
