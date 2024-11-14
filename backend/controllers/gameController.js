const {
	generateRoomId,
	joinRoom,
	updateGameState,
	playerDisconnect,
} = require("../services/gameService.js");

const getRoomId = (socket, io) => (callback) =>
	generateRoomId()
		? callback({ success: true, roomId })
		: callback({ success: false, message: "Unable to create room." });

const handleJoinRoom =
	(socket, io) =>
	({ roomId, playerName, roomName }, callback) => {
		const result = joinRoom(roomId, playerName, roomName, socket.id);
		if (result.success) {
			socket.join(roomId);
			callback(result);
			console.log("result", result);

			// Notify both players to start the game if room is full
			if (Object.keys(result.roomState.players).length === 2) {
				io.to(roomId).emit("startGame", result.roomState);
			}
		} else {
			callback(result);
		}
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

module.exports = { getRoomId, handleJoinRoom, handleMove, handleDisconnect };
