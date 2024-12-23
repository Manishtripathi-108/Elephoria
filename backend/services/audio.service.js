import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { backendLogger } from '../utils/logger.utils.js';
import { uploadAudioToCloudinary, uploadImageToCloudinary } from './cloudinary.service.js';
import { createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';

/**
 * Extracts metadata, lyrics, and cover image from an audio file.
 *
 * @param {string} fileUrl - URL of the audio file to process.
 * @param {AbortSignal} abortSignal - Optional signal to cancel processing.
 * @returns {Promise<{success: boolean, metadata?: object, coverImage?: string, message?: string, error?: object}>}
 */
export const extractMetadata = async (fileUrl, abortSignal) => {
    const fallbackImageUrl =
        'https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png';
    let metadata,
        coverImage = fallbackImageUrl;

    const tempDir = getTempPath('images');
    const coverImagePath = getTempPath('images', `cover_${Date.now()}.jpg`);

    try {
        // Ensure temporary directory exists
        await createDirectoryIfNotExists(tempDir);

        // Extract metadata
        metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(fileUrl, (error, extractedMetadata) => {
                if (error) {
                    return reject({ success: false, message: 'Error extracting metadata', error });
                }
                resolve(extractedMetadata);
            });
        });

        // Extract lyrics
        const lyrics = await new Promise((resolve) => {
            const ffprobeCommand = `ffprobe -i "${fileUrl}" -show_entries format_tags=lyrics -of json`;
            exec(ffprobeCommand, (error, stdout) => {
                if (error) {
                    backendLogger.warn('Error extracting lyrics', { error });
                    return resolve('No lyrics found');
                }
                try {
                    const extractedLyrics = JSON.parse(stdout)?.format?.tags?.lyrics || 'No lyrics found';
                    resolve(extractedLyrics);
                } catch (parseError) {
                    backendLogger.warn('Error parsing lyrics data', { parseError });
                    resolve('No lyrics found');
                }
            });
        });

        metadata.format = { ...(metadata.format || {}), tags: { ...metadata.format?.tags, lyrics } };

        // Extract cover image
        const coverStream = metadata.streams?.find(
            (stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video'
        );
        if (coverStream) {
            coverImage = await new Promise((resolve) => {
                ffmpeg(fileUrl)
                    .outputOptions('-map', `0:${coverStream.index}`)
                    .save(coverImagePath)
                    .on('end', async () => {
                        const uploadResult = await uploadImageToCloudinary(coverImagePath, abortSignal);
                        resolve(uploadResult.success ? uploadResult.url : fallbackImageUrl);
                    })
                    .on('error', (error) => {
                        backendLogger.warn('Error extracting cover image', { error });
                        resolve(fallbackImageUrl);
                    });
            });
        }

        return { success: true, metadata, coverImage };
    } catch (error) {
        return { success: false, message: 'Failed to process the file. Please try again.', error };
    }
};

/**
 * Edits metadata of an audio file.
 *
 * @param {string} fileUrl - URL of the audio file to edit.
 * @param {object} metadata - Metadata key-value pairs to be updated.
 * @param {string} fileExtension - File extension for the edited file.
 * @returns {Promise<{success: boolean, url?: string, message?: string, error?: object}>}
 */
export const editMetadata = async (fileUrl, metadata, fileExtension) => {
    const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);

    try {
        return await new Promise((resolve, reject) => {
            const command = ffmpeg(fileUrl);

            // Add metadata fields to the ffmpeg command
            Object.entries(metadata).forEach(([key, value]) => {
                command.outputOptions('-metadata', `${key}=${value || ''}`);
            });

            command
                .outputOptions('-c copy') // Copy stream without re-encoding
                .save(outputFilePath)
                .on('end', async () => {
                    const uploadResult = await uploadAudioToCloudinary(outputFilePath);
                    if (!uploadResult.success) {
                        return reject(uploadResult);
                    }
                    resolve({ success: true, url: uploadResult.url });
                })
                .on('error', (error) => {
                    reject({ success: false, message: 'Failed to edit the file metadata.', error });
                });
        });
    } catch (error) {
        return { success: false, message: 'An error occurred while editing metadata. Please try again.', error };
    }
};
