import cloudinary from '../config/cloudinary.config.js';
import { cleanupFile } from '../utils/pathAndFile.utils.js';

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
        return {
            success: false,
            message: 'Error deleting file from Cloudinary',
            error,
        };
    }
};

/**
 * Uploads a file to Cloudinary.
 * @param {string} localFilePath - The local path of the file to upload.
 * @param {object} options - Configuration options for the upload.
 * @param {string} options.targetFolder - The Cloudinary folder for the upload.
 * @param {string} [options.resourceType='image'] - The type of the resource (e.g., 'image', 'video').
 * @param {AbortSignal} [options.abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [options.shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadFileToCloudinary = async (localFilePath, options) => {
    const { targetFolder, resourceType = 'image', abortSignal = null, shouldDeleteLocalFile = true } = options;

    try {
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder: targetFolder,
            signal: abortSignal,
        });

        if (shouldDeleteLocalFile) {
            cleanupFile(localFilePath);
        }

        return {
            success: true,
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            message: 'File uploaded successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error uploading file to Cloudinary',
            error,
        };
    }
};

/**
 * Uploads an image to Cloudinary.
 * @param {string} imageFilePath - The local path of the image file to upload.
 * @param {AbortSignal} [abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadImageToCloudinary = async (imageFilePath, abortSignal = null, shouldDeleteLocalFile = true) => {
    return await uploadFileToCloudinary(imageFilePath, {
        targetFolder: 'uploads/images',
        resourceType: 'image',
        abortSignal,
        shouldDeleteLocalFile,
    });
};

/**
 * Uploads an audio file to Cloudinary.
 * @param {string} audioFilePath - The local path of the audio file to upload.
 * @param {AbortSignal} [abortSignal=null] - Optional abort signal to cancel the upload request.
 * @param {boolean} [shouldDeleteLocalFile=true] - Whether to delete the local file after upload.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, publicId?: string}>}
 */
export const uploadAudioToCloudinary = async (audioFilePath, abortSignal = null, shouldDeleteLocalFile = true) => {
    return await uploadFileToCloudinary(audioFilePath, {
        targetFolder: 'uploads/audio',
        resourceType: 'video', // Cloudinary uses 'video' for audio files
        abortSignal,
        shouldDeleteLocalFile,
    });
};
