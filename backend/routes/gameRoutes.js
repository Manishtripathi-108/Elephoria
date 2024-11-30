const {
	getRoomId,
	handleJoinRoom,
	handleStartGame,
	handleMove,
	handleDisconnect,
} = require("../controllers/gameController");

const gameRoutes = (io) => {
	io.on("connection", (socket) => {
		socket.on("getRoomId", getRoomId(socket, io));
		socket.on("joinRoom", handleJoinRoom(socket, io));
		socket.on("startGame", handleStartGame(socket, io));
		socket.on("move", handleMove(socket, io));
		socket.on("disconnect", handleDisconnect(socket, io));
	});
};

module.exports = gameRoutes;
