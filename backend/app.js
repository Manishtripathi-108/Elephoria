import gameRoutes from './routes/game.routes.js';
import routes from './routes/index.js';
import { backendLogger } from './utils/logger.utils.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { join, resolve } from 'path';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// HTTP server with Express app
const server = createServer(app);

/* --------------------------- CORS configuration --------------------------- */
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URLS.split(',').map((url) => url.trim()) : '*',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
};

// Socket.io with CORS options
const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));

/* ------------------------ Middleware configuration ------------------------ */
app.use(express.json());
app.use(cookieParser());
// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err.message);
//     res.status(500).json({
//         success: false,
//         error: true,
//         message: err.message || 'An unexpected error occurred.',
//     });
// });

/* ------------------------------- API routes ------------------------------- */
app.use('/api', routes);

gameRoutes(io);

/* ------------------ Serve Static Files for Uploaded Images ---------------- */
// Resolve uploads directory using relative path from current file
const uploadsPath = resolve('./uploads');
app.use('/uploads', express.static(uploadsPath));

export { app, server, io };
