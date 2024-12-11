import {
	getRoomId,
	handleClearBoard,
	handleJoinRoom,
	handleMove,
	handleBoardChange,
	handleStartGame,
	handleLeaveRoom,
} from "../controllers/game.controller.js";
import { backendLogger } from "../utils/logger.js";
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
		});
		socket.on("playerMove", handleMove(socket, io));
		socket.on("setBoard", handleBoardChange(socket, io));
		socket.on("startGame", handleStartGame(socket, io));

		socket.on("disconnect", () => {
			backendLogger.info(`User disconnected: ${socket.id}`);
		});
	});

	// Handle cleanup via `leave-room` adapter event
	io.of("/").adapter.on("leave-room", (roomId, socketId) => {
		handleLeaveRoom(roomId, socketId, io);
	});
};

export default gameRoutes;
