import cloudinary from '../config/cloudinary.config.js';
import { backendLogger } from '../utils/logger.utils.js';
import { cleanupFiles } from '../utils/pathAndFile.utils.js';

/**
 * Uploads a file to Cloudinary.
 * @param {Buffer|string} file - The file to upload (Buffer for in-memory, string for file path).
 * @param {object} options - Configuration options for the upload.
 * @param {string} options.targetFolder - The Cloudinary folder for the upload.
 * @param {string} [options.resourceType='image'] - The type of the resource (e.g., 'image', 'video').
 * @param {AbortSignal} [options.abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [options.shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @param {boolean} [options.stream=false] - Whether to use streaming upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadFileToCloudinary = async (file, options) => {
    const { targetFolder, resourceType = 'image', abortSignal = null, shouldDeleteLocalFile = true } = options;

    try {
        const uploadOptions = {
            resource_type: resourceType,
            folder: targetFolder,
            signal: abortSignal,
        };

        let uploadResponse;

        if (Buffer.isBuffer(file)) {
            uploadResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
                uploadStream.end(file);
            });
        } else if (typeof file === 'string') {
            uploadResponse = await cloudinary.uploader.upload(file, uploadOptions);
        } else {
            throw new Error('Invalid file input: must be a Buffer or a file path string.');
        }

        return {
            success: true,
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            message: 'File uploaded successfully',
        };
    } catch (error) {
        backendLogger.error('Error uploading file to Cloudinary:', error);
        return {
            success: false,
            message: 'Error uploading file to Cloudinary',
            error,
        };
    } finally {
        if (shouldDeleteLocalFile && typeof file === 'string') {
            cleanupFiles([file]);
        }
    }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} cloudinaryPublicId - The Cloudinary public ID of the file to delete.
 * @returns {Promise<{success: boolean, message: string, error?: Error}>}
 */
export const deleteCloudinaryFile = async (cloudinaryPublicId) => {
    try {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        backendLogger.error('Error deleting file from Cloudinary:', error);
        return {
            success: false,
            message: 'Error deleting file from Cloudinary',
            error,
        };
    }
};

/**
 * Downloads an audio file from Cloudinary.
 * @param {string} cloudinaryPublicId - The Cloudinary public ID of the audio file to download.
 * @param {AbortSignal} [abortSignal=null] - Optional abort signal to cancel the download request.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, format?: string}>}
 */
export const downloadAudioFromCloudinary = async (cloudinaryPublicId, abortSignal = null) => {
    try {
        const downloadResponse = await cloudinary.api.resource(cloudinaryPublicId, {
            resource_type: 'video',
            signal: abortSignal,
        });

        return {
            success: true,
            url: downloadResponse.secure_url,
            format: downloadResponse.format,
        };
    } catch (error) {
        backendLogger.error('Error downloading audio from Cloudinary:', error);
        return {
            success: false,
            message: 'Error downloading audio from Cloudinary',
            error,
        };
    }
};

/**
 * Uploads an image to Cloudinary.
 * @param {Buffer|string} imageFile - The image file to upload (Buffer for in-memory, string for file path).
 * @param {AbortSignal} [abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadImageToCloudinary = async (imageFile, abortSignal = null, shouldDeleteLocalFile = true) => {
    return await uploadFileToCloudinary(imageFile, {
        targetFolder: 'uploads/images',
        resourceType: 'image',
        abortSignal,
        shouldDeleteLocalFile,
    });
};

/**
 * Uploads an audio file to Cloudinary.
 * @param {Buffer|string} audioFile - The audio file to upload (Buffer for in-memory, string for file path).
 * @param {AbortSignal} [abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadAudioToCloudinary = async (audioFile, abortSignal = null, shouldDeleteLocalFile = true) => {
    return await uploadFileToCloudinary(audioFile, {
        targetFolder: 'uploads/audio',
        resourceType: 'video', // Cloudinary uses 'video' for audio files
        abortSignal,
        shouldDeleteLocalFile,
    });
};
