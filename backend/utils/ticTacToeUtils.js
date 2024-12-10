const WINNING_PATTERNS = {
	9: [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	],
	16: [
		[0, 1, 2, 3],
		[4, 5, 6, 7],
		[8, 9, 10, 11],
		[12, 13, 14, 15],
		[0, 4, 8, 12],
		[1, 5, 9, 13],
		[2, 6, 10, 14],
		[3, 7, 11, 15],
		[0, 5, 10, 15],
		[3, 6, 9, 12],
	],
	25: [
		[0, 1, 2, 3, 4],
		[5, 6, 7, 8, 9],
		[10, 11, 12, 13, 14],
		[15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24],
		[0, 5, 10, 15, 20],
		[1, 6, 11, 16, 21],
		[2, 7, 12, 17, 22],
		[3, 8, 13, 18, 23],
		[4, 9, 14, 19, 24],
		[0, 6, 12, 18, 24],
		[4, 8, 12, 16, 20],
	],
};

const evaluateBoardStatus = (board) => {
	for (const [a, b, c] of WINNING_PATTERNS[9]) {
		if (board[a] === "D") continue;

		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return { status: "win", winner: board[a], line: [a, b, c] };
		}
	}
	const isBoardFull = board.every((cell) => cell);
	if (isBoardFull) return { status: "draw" };
	return { status: "continue" };
};

const initialRoom = {
	// Game mode and boards
	mode: "classic", // 'classic' or 'ultimate'
	classicBoard: Array(9).fill(null),
	ultimateBoard: Array(9).fill(Array(9).fill(null)),

	// Online play
	roomId: null,
	roomName: null,
	gameStarted: false,

	// Game state
	isXNext: true,
	isGameOver: false,
	winner: null,
	winIndexes: null,
	isDraw: false,
	drawScore: 0,
	activeIndex: null,

	// Player details
	playerX: { id: null, name: null, score: 0 },
	playerO: { id: null, name: null, score: 0 },
};

export { WINNING_PATTERNS, evaluateBoardStatus, initialRoom };
