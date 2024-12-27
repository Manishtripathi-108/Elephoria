import { join, resolve } from 'path';
import { createLogger, format, transports } from 'winston';

// Safe JSON stringify to handle circular references
function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(
        obj,
        (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        },
        2
    ); // Add spacing for better readability
}

// Custom log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...metadata }) => {
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            logMessage += ` | Metadata: ${safeStringify(metadata)}`;
        }
        return logMessage;
    })
);

// Helper function to create a logger
function createCustomLogger(logFileName) {
    return createLogger({
        level: 'info',
        format: logFormat,
        transports: [
            new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
            }),
            new transports.File({
                filename: join(resolve('logs'), logFileName),
            }),
        ],
    });
}

// Logger for backend logs
export const backendLogger = createCustomLogger('backend.log');

// Logger for frontend logs
export const frontendLogger = createCustomLogger('frontend.log');
