const {
	getRoomId,
	handleClearBoard,
	handleJoinRoom,
	handleMove,
	handleModeChange,
	handleStartGame,
	handleLeaveRoom,
} = require("../controllers/gameController");
const { backendLogger } = require("../utils/logger");

const gameRoutes = (io) => {
	io.on("connection", (socket) => {
		backendLogger.info(`User connected: ${socket.id}`);

		// Register socket event handlers
		socket.on("clearBoard", handleClearBoard(socket, io));
		socket.on("getRoomId", getRoomId(socket, io));
		socket.on("joinRoom", handleJoinRoom(socket, io));
		socket.on("leaveRoom", (roomId) => {
			socket.leave(roomId);
			socket.emit("roomLeft");
			backendLogger.info(`User simply left room: ${roomId}`);
		});
		socket.on("playerMove", handleMove(socket, io));
		socket.on("setMode", handleModeChange(socket, io));
		socket.on("startGame", handleStartGame(socket, io));
	});

	// Handle cleanup via `leave-room` adapter event
	io.of("/").adapter.on("leave-room", (roomId, socketId) => {
		handleLeaveRoom(roomId, socketId, io);
	});
};

module.exports = gameRoutes;
