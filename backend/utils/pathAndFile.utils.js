import { backendLogger } from './logger.utils.js';
import { existsSync, unlinkSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

/**
 * Base directory for constructing paths.
 * Defaults to `process.cwd()` but can be dynamically set via environment variables.
 */
const BASE_DIR = process.cwd();

/**
 * General-purpose function for building paths dynamically.
 * Resolves paths relative to the BASE_DIR.
 *
 * @param {...string} segments - Path segments to join and resolve.
 * @returns {string} - Absolute path.
 * @example
 * const projectPath = buildPath('src', 'index.ts');
 * // Returns: '/path/to/project/src/index.ts'
 */
export const buildPath = (...segments) => {
    return path.resolve(BASE_DIR, ...segments);
};

/**
 * Returns the path to the uploads directory, with optional subdirectories.
 *
 * @param {string[]} subFolders - Optional subdirectories inside the uploads directory.
 * @returns {string} - Path to the uploads directory or a subdirectory inside it.
 * @example
 * const uploadFilePath = getUploadPath('audio', 'example.mp3');
 * // Returns: '/path/to/project/uploads/audio/example.mp3'
 * @example
 * const uploadFilePath = getUploadPath('audio');
 * // Returns: '/path/to/project/uploads/audio'
 */
export const getUploadPath = (...subFolders) => {
    return buildPath('uploads', ...subFolders);
};

/**
 * Returns the path to the logs directory, with optional filename.
 *
 * @param {string} [logFileName=''] - Optional log file name.
 * @returns {string} - Path to the logs directory or a specific log file.
 * @example
 * const logFilePath = getLogsPath('error.log');
 * // Returns: '/path/to/project/logs/error.log'
 * @example
 * const logFilePath = getLogsPath();
 * // Returns: '/path/to/project/logs'
 */
export const getLogsPath = (logFileName = '') => {
    return buildPath('logs', logFileName);
};

/**
 * Returns the path to the temporary files directory.
 *
 * @param {string[]} subFolders - Optional subdirectories inside the temp directory.
 * @returns {string} - Path to the temp directory or a subdirectory inside it.
 * @example
 * const tempFilePath = getTempPath('tempfile.txt');
 * // Returns: '/path/to/project/temp/tempfile.txt'
 */
export const getTempPath = (...subFolders) => {
    return buildPath('temp', ...subFolders);
};

/**
 * Returns the path to the cache directory, with optional subdirectories.
 *
 * @param {string[]} subFolders - Optional subdirectories inside the cache directory.
 * @returns {string} - Path to the cache directory or a subdirectory inside it.
 * @example
 * const cacheFilePath = getCachePath('audio', 'example.mp3');
 * // Returns: '/path/to/project/cache/audio/example.mp3'
 */
export const getCachePath = (...subFolders) => {
    return buildPath('cache', ...subFolders);
};

/**
 * Returns the path to the configuration directory or file.
 *
 * @param {string} [configFileName=''] - Optional configuration file name.
 * @returns {string} - Path to the configuration directory or a specific file.
 * @example
 * const configFilePath = getConfigPath('config.json');
 * // Returns: '/path/to/project/config/config.json'
 */
export const getConfigPath = (configFileName = '') => {
    return buildPath('config', configFileName);
};

/**
 * Utility to get paths relative to a custom base directory.
 *
 * @param {string} baseDir - Custom base directory.
 * @param {...string} segments - Path segments to resolve relative to the base directory.
 * @returns {string} - Absolute path resolved against the base directory.
 * @example
 * const projectPath = getCustomPath('/path/to/project', 'src', 'index.ts');
 * // Returns: '/path/to/project/src/index.ts'
 */
export const getCustomPath = (baseDir, ...segments) => {
    return path.resolve(baseDir, ...segments);
};

/**
 * Ensures that a directory exists at the specified path.
 * If the directory does not exist, it is created, including any
 * necessary parent directories.
 *
 * @param {string} dirPath - The path of the directory to check or create.
 * @returns {Promise<void>} - Resolves when the directory is created or already exists.
 * @throws {Error} - Throws an error if the directory cannot be created.
 * @example
 * await createDirectoryIfNotExists('/path/to/directory');
 */
export const createDirectoryIfNotExists = async (dirPath) => {
    if (!existsSync(dirPath)) {
        try {
            await mkdir(dirPath, { recursive: true });
        } catch (error) {
            backendLogger.error('Error creating directory:', error);
            throw new Error(`Failed to create directory at ${dirPath}`);
        }
    }
};

/**
 * Utility to clean up a file.
 * @param {string} filePath - Path to the file to delete.
 * @example
 * cleanupFile('/path/to/file.txt');
 */
export const cleanupFile = (filePath) => {
    try {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            backendLogger.info(`Deleted file: ${filePath}`);
        }
    } catch (error) {
        backendLogger.error(`Failed to delete file ${filePath}:`, error);
    }
};
