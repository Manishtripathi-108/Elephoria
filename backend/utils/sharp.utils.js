import { backendLogger } from './logger.utils.js';
import sharp from 'sharp';

/**
 * Resizes an image to a specified width and height, cropping it if necessary.
 * @param {Buffer|string} image - The image to resize and crop. Can be a Buffer or a file path.
 * @param {boolean} [returnBuffer=false] - Whether to return the resized image as a Buffer or write it to a file.
 * @param {string} [outputPath] - The file path to write the resized image to if returnBuffer is false.
 * @returns {Promise<{success: boolean, buffer?: Buffer, path?: string}>} - A promise that resolves with an object containing a success boolean and either a Buffer or a file path string, depending on returnBuffer.
 */
export const resizeAndCropImage = async (image, returnBuffer = false, outputPath) => {
    try {
        const resizedAndCroppedImage = sharp(image)
            .resize(640, 640, {
                fit: sharp.fit.cover,
            })
            .toFormat('jpg');

        if (returnBuffer) {
            const buffer = await resizedAndCroppedImage.toBuffer();
            return { success: true, buffer };
        } else {
            await resizedAndCroppedImage.toFile(outputPath);
            return { success: true, path: outputPath };
        }
    } catch (err) {
        backendLogger.error('Error resizing and cropping image', { error: err });
        return { success: false };
    }
};
