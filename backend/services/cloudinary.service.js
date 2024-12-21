import { unlinkSync } from 'fs';
import cloudinary from '../config/cloudinary.config.js';

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - The public id of the image to delete.
 * @returns {Promise<{success: boolean, message: string, error?: Error}>} - A promise that resolves to an object with a "success" property.
 * If the request succeeds, the "success" property is true.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const deleteFileFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        return {
            success: false,
            message: 'Error deleting file from Cloudinary',
            error,
        };
    }
};

const uploadToCloudinary = async (fileLocation, targetFolder, resourceType = 'image', abortToken) => {
    try {
        const result = await cloudinary.uploader.upload(fileLocation, {
            resource_type: resourceType,
            folder: targetFolder,
            cancelToken: abortToken,
        });
        unlinkSync(fileLocation);
        return {
            success: true,
            message: 'File uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id,
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
 * @param {string} filePath - The path of the local image file to upload.
 * @param {object} abortToken - The token to cancel the upload request.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, public_id?: string}>} - A promise that resolves to an object with a "success" property.
 * If the request succeeds, the "success" property is true and a "url" and "public_id" property are provided.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const uploadImageToCloudinary = async (filePath, abortToken) => {
    return await uploadToCloudinary(filePath, 'uploads/images', 'image', abortToken);
};

/**
 * Uploads an audio file to Cloudinary.
 * @param {string} filePath - The path of the local audio file to upload.
 * @param {object} abortToken - The token to cancel the upload request.
 * @returns {Promise<{success: boolean, message: string, error?: Error, url?: string, public_id?: string}>} - A promise that resolves to an object with a "success" property.
 * If the request succeeds, the "success" property is true and a "url" and "public_id" property are provided.
 * If the request fails, the "success" property is false and an error message is provided.
 */
export const uploadAudioToCloudinary = async (filePath, abortToken) => {
    return await uploadToCloudinary(filePath, 'uploads/audio', 'audio', abortToken);
};
