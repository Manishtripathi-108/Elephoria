import { backendLogger } from '../utils/logger.utils.js';
import { createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';
import { uploadImageToCloudinary } from './cloudinary.service.js';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

// Constants
const FALLBACK_IMAGE_URL =
    'https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png';

/**
 * Utility to extract metadata using FFprobe.
 * @param {string} fileUrl - URL of the audio file.
 * @returns {Promise<object>} - Extracted metadata.
 */
const getMetadataFromFFprobe = async (fileUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileUrl, (error, metadata) => {
            if (error) {
                reject(new Error('Failed to extracting metadata.'));
            } else {
                resolve(metadata);
            }
        });
    });
};

/**
 * Utility to extract lyrics using FFprobe CLI.
 * @param {string} fileUrl - URL of the audio file.
 * @returns {Promise<string>} - Extracted lyrics or a default message.
 */
const extractLyrics = async (fileUrl) => {
    return new Promise((resolve) => {
        const command = `ffprobe -i "${fileUrl}" -show_entries format_tags=lyrics -of json`;
        exec(command, (error, stdout) => {
            if (error) {
                backendLogger.warn('Error extracting lyrics', { error });
                resolve('No lyrics found');
            } else {
                try {
                    const lyrics = JSON.parse(stdout)?.format?.tags?.lyrics || 'No lyrics found';
                    resolve(lyrics);
                } catch (parseError) {
                    backendLogger.warn('Error parsing lyrics data', { parseError });
                    resolve('No lyrics found');
                }
            }
        });
    });
};

/**
 * Extracts audio metadata, lyrics, and cover image from a file.
 * @param {string} fileUrl - The URL of the audio file to process.
 * @param {AbortSignal} abortSignal - Optional signal for cancellation.
 * @returns {Promise<{success: boolean, metadata?: object, coverImage?: string, message?: string, error?: object}>}
 */
export const extractAudioMetadata = async (fileUrl, abortSignal) => {
    try {
        const coverImagePath = getTempPath('images', `cover_${Date.now()}.jpg`);
        await createDirectoryIfNotExists(getTempPath('images'));

        const metadata = await getMetadataFromFFprobe(fileUrl);
        const lyrics = await extractLyrics(fileUrl);

        metadata.format = { ...(metadata.format || {}), tags: { ...metadata.format?.tags, lyrics } };

        // Extract cover image
        const coverStream = metadata.streams?.find(
            (stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video'
        );

        let coverImage = FALLBACK_IMAGE_URL;
        if (coverStream) {
            try {
                await new Promise((resolve, reject) => {
                    ffmpeg(fileUrl)
                        .outputOptions('-map', `0:${coverStream.index}`)
                        .save(coverImagePath)
                        .on('end', resolve)
                        .on('error', reject);
                });
                const uploadResult = await uploadImageToCloudinary(coverImagePath, abortSignal);
                coverImage = uploadResult.success ? uploadResult.url : FALLBACK_IMAGE_URL;
            } catch (error) {
                backendLogger.warn('Error uploading cover image or extracting it', { error });
            }
        }

        return { success: true, metadata: metadata?.format?.tags, coverImage };
    } catch (error) {
        backendLogger.error('Unexpected error in extractAudioMetadata', error);
        return { success: false, message: error.message, error };
    }
};

/**
 * Edits audio metadata and optionally attaches a cover image.
 * @param {string} fileUrl - The URL of the audio file to process.
 * @param {string} fileExtension - File extension of the audio file.
 * @param {object} metadata - Metadata to edit.
 * @param {string} [coverImagePath] - Path to the cover image file.
 * @returns {Promise<{success: boolean, fileUrl?: string, message?: string, error?: object}>}
 */
export const editAudioMetadata = async (fileUrl, fileExtension, metadata, coverImagePath) => {
    try {
        const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);
        await createDirectoryIfNotExists(getTempPath('audio'));

        const command = ffmpeg(fileUrl);

        // Attach cover image if provided
        if (coverImagePath) {
            command.input(coverImagePath).outputOptions('-map', '0:a', '-map', '1', '-disposition:v', 'attached_pic');
        }

        // Add metadata
        Object.entries(metadata).forEach(([key, value]) => {
            command.outputOptions('-metadata', `${key}=${value || ''}`);
        });

        await new Promise((resolve, reject) => {
            command
                .outputOptions('-c', 'copy') // Use 'copy' to avoid re-encoding
                .save(outputFilePath)
                .on('end', resolve)
                .on('error', (error) => reject(error));
        });

        return { success: true, fileUrl: outputFilePath };
    } catch (error) {
        backendLogger.error('Unexpected error in editAudioMetadata', error);
        return { success: false, message: 'Failed to edit audio metadata', error };
    }
};
