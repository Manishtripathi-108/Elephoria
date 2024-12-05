const {
	generateRoomId,
	joinRoom,
	startGame,
	changeBoard,
	leaveRoom,
	updateGameState,
	clearBoard,
} = require("../services/gameService.js");
const { backendLogger } = require("../utils/logger.js");

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
				isLoading: false,
				isWaiting: true,
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

			backendLogger.warn(`Unable to join room: ${roomId}:`, {
				message: result.message || "Unable to join the room.",
			});
		}
	};

const handleStartGame =
	(socket, io) =>
	({ roomId }) => {
		const result = startGame(roomId);

		if (result.success) {
			io.to(roomId).emit("updateGame", {
				...result.roomState,
				isWaiting: false,
			});
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

const handleBoardChange =
	(socket, io) =>
	({ roomId, mode }) => {
		const result = changeBoard(roomId, mode);

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

const handleLeaveRoom = (roomId, socketId, io) => {
	if (!roomId || !socketId || roomId === socketId) {
		return;
	}
	const result = leaveRoom(roomId, socketId);

	if (result.success) {
		// Notify others in the room about the updated state
		if (result.roomState) {
			io.to(roomId).emit("gameError", "Opponent left the room.");

			io.to(roomId).emit("updateGame", {
				isWaiting: true,
				...result.roomState,
			});
		}
	} else {
		// Send error message to the disconnected socket
		io.to(socketId).emit(
			"gameError",
			result.message || "Error during room cleanup."
		);
	}
};

module.exports = {
	getRoomId,
	handleJoinRoom,
	handleStartGame,
	handleMove,
	handleBoardChange,
	handleClearBoard,
	handleLeaveRoom,
};
