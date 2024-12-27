import axios from 'axios'

import API_ROUTES from '../constants/apiEndpoints'

const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
}

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
    info: (message, metadata = {}) => {
        if (isDevelopment) {
            console.info(`%c[INFO] ${message}`, 'color: blue', metadata)
        }
        logToServer(LOG_LEVELS.INFO, message, metadata)
    },
    warn: (message, metadata = {}) => {
        if (isDevelopment) {
            console.warn(`%c[WARN] ${message}`, 'color: orange', metadata)
        }
        logToServer(LOG_LEVELS.WARN, message, metadata)
    },
    error: (message, metadata = {}) => {
        console.error(`%c[ERROR] ${message}`, 'color: red', metadata)
        logToServer(LOG_LEVELS.ERROR, message, metadata)
    },
}

// Function to send logs to the backend
async function logToServer(level, message, metadata) {
    try {
        await axios.post(API_ROUTES.LOGS.FRONTEND, {
            level,
            message,
            metadata,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Failed to log to server:', error)
    }
}

export default logger
