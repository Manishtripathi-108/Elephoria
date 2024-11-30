const {
	generateRoomId,
	joinRoom,
	startGame,
	updateGameState,
	playerDisconnect,
} = require("../services/gameService.js");

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
			if (Object.keys(result.roomState.players).length === 2) {
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

const handleMove =
	(socket, io) =>
	({ roomId, moveData }) => {
		const room = updateGameState(roomId, moveData);
		if (room) {
			io.to(roomId).emit("updateGame", moveData);
		}
	};

const handleDisconnect = (socket, io) => () => {
	// const roomId = playerDisconnect(socket.id);
	// if (roomId) {
	// 	io.to(roomId).emit("playerDisconnected", {
	// 		message: "Player disconnected",
	// 	});
	// }
};

module.exports = {
	getRoomId,
	handleJoinRoom,
	handleMove,
	handleDisconnect,
	handleStartGame,
};
