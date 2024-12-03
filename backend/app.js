const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const gameRoutes = require("./routes/gameRoutes");
const { backendLogger } = require("./utils/logger");

const app = express();

// HTTP server with Express app
const server = http.createServer(app);

// Socket.io with CORS options
const io = new Server(server, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

// Middleware configuration
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CLIENT_URL
				: "http://localhost",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api", routes);
gameRoutes(io);

/* ------------------ Serve Static Files for Uploaded Images ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = { app, server, io };
