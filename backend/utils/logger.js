const { createLogger, format, transports } = require("winston");
const path = require("path");

// Custom log format
const logFormat = format.combine(
	format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	format.printf(({ timestamp, level, message, ...metadata }) => {
		let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
		if (metadata) {
			logMessage += ` | Metadata: ${JSON.stringify(metadata)}`;
		}
		return logMessage;
	})
);

// Logger for backend logs
const backendLogger = createLogger({
	level: "info",
	format: logFormat,
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
		new transports.File({
			filename: path.join(__dirname, "../logs/backend.log"),
		}),
	],
});

// Logger for frontend logs
const frontendLogger = createLogger({
	level: "info",
	format: logFormat,
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
		new transports.File({
			filename: path.join(__dirname, "../logs/frontend.log"),
		}),
	],
});

module.exports = { backendLogger, frontendLogger };
