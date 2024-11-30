const {
	getRoomId,
	handleClearBoard,
	handleDisconnect,
	handleJoinRoom,
	handleLeaveRoom,
	handleModeChange,
	handleMove,
	handleStartGame,
} = require("../controllers/gameController");

const gameRoutes = (io) => {
	io.on("connection", (socket) => {
		socket.on("clearBoard", handleClearBoard(socket, io));
		socket.on("disconnect", handleDisconnect(socket, io));
		socket.on("getRoomId", getRoomId(socket, io));
		socket.on("joinRoom", handleJoinRoom(socket, io));
		socket.on("leaveRoom", handleLeaveRoom(socket, io));
		socket.on("playerMove", handleMove(socket, io));
		socket.on("setMode", handleModeChange(socket, io));
		socket.on("startGame", handleStartGame(socket, io));
	});
};

module.exports = gameRoutes;
