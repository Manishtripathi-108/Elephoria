const rooms = {};

const generateRoomId = () => {
	do {
		roomId = Math.random().toString(36).substring(2, 8);
	} while (Object.keys(rooms).includes(roomId));

	return roomId;
};

const joinRoom = (roomId, playerName, roomName, socketId) => {
	let room = rooms[roomId];

	if (!room) {
		room = {
			roomId,
			name: roomName,
			players: {},
			gameState: {
				isXNext: true,
			},
		};
		rooms[roomId] = room;
	}

	const existingPlayer = room.players[socketId];
	if (existingPlayer)
		return {
			success: true,
			symbol: existingPlayer.symbol,
			roomState: room,
		};

	const playerCount = Object.keys(room.players).length;
	const playerSymbol = playerCount === 0 ? "X" : "O";

	if (playerCount < 2) {
		room.players[socketId] = { name: playerName, symbol: playerSymbol };
		return { success: true, symbol: playerSymbol, roomState: room };
	}

	return { success: false, message: "Room is full" };
};

const startGame = (roomId) => {
	const room = rooms[roomId];

	if (room && Object.keys(room.players).length === 2) {
		return { success: true, roomState: room };
	}

	return {
		success: false,
		message: room ? "Players not found" : "Room does not exist",
	};
};

const updateGameState = (roomId, moveData) => {
	const room = rooms[roomId];
	if (room) {
		room.gameState = moveData;
		return room;
	}
	return null;
};

const handleDisconnect = (socketId) => {
	for (const roomId in rooms) {
		const room = rooms[roomId];
		if (room.players[socketId]) {
			delete room.players[socketId];
			return roomId;
		}
	}
	return null;
};

module.exports = {
	generateRoomId,
	joinRoom,
	startGame,
	updateGameState,
	handleDisconnect,
};
