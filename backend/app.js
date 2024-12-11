import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { join, resolve } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import gameRoutes from "./routes/game.routes.js";
import { backendLogger } from "./utils/logger.js";

const app = express();

// Load environment variables
dotenv.config();

// HTTP server with Express app
const server = createServer(app);

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
// Resolve uploads directory using relative path from current file
const uploadsPath = resolve("./uploads");
app.use("/uploads", express.static(uploadsPath));

export { app, server, io };
