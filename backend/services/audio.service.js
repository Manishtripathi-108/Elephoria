import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { PassThrough } from 'stream';
import { backendLogger } from '../utils/logger.utils.js';
import { uploadAudioToCloudinary, uploadImageToCloudinary } from './cloudinary.service.js';
import { createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';

// Constants
const FALLBACK_IMAGE_URL =
    'https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png';

/**
 * Utility to extract metadata using FFprobe.
 * @param {string} fileUrl - URL of the audio file.
 * @returns {Promise<object>} - Extracted metadata.
 */
const getMetadataFromFFprobe = (fileUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileUrl, (error, metadata) => {
            if (error) {
                return reject(new Error('Error extracting metadata with FFprobe.'));
            }
            resolve(metadata);
        });
    });
};

/**
 * Utility to extract lyrics using FFprobe CLI.
 * @param {string} fileUrl - URL of the audio file.
 * @returns {Promise<string>} - Extracted lyrics or a default message.
 */
const extractLyrics = (fileUrl) => {
    return new Promise((resolve) => {
        const command = `ffprobe -i "${fileUrl}" -show_entries format_tags=lyrics -of json`;
        exec(command, (error, stdout) => {
            if (error) {
                backendLogger.warn('Error extracting lyrics', { error });
                return resolve('No lyrics found');
            }
            try {
                const lyrics = JSON.parse(stdout)?.format?.tags?.lyrics || 'No lyrics found';
                resolve(lyrics);
            } catch (parseError) {
                backendLogger.warn('Error parsing lyrics data', { parseError });
                resolve('No lyrics found');
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
    // * Change the code here (if not using Buffer): uncomment the line below
    // const tempDir = getTempPath('images');
    // const coverImagePath = getTempPath('images', `cover_${Date.now()}.jpg`);

    try {
        // await createDirectoryIfNotExists(tempDir);

        const [metadata, lyrics] = await Promise.all([getMetadataFromFFprobe(fileUrl), extractLyrics(fileUrl)]);

        metadata.format = { ...(metadata.format || {}), tags: { ...metadata.format?.tags, lyrics } };

        // Extract cover image
        const coverStream = metadata.streams?.find(
            (stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video'
        );

        const coverImage =
            coverStream &&
            (await new Promise((resolve) => {
                // * Change the code here (if not using Buffer): remove the 2 lines below
                const outputBuffer = [];
                const outputStream = new PassThrough();

                ffmpeg(fileUrl)
                    .outputOptions('-map', `0:${coverStream.index}`)
                    // * Change the code here (if not using Buffer): uncomment the line below and remove .toFormat, .pipe & .on('data') + both finalBuffer lines
                    // .save(coverImagePath)
                    .toFormat('image2')
                    .pipe(outputStream, { end: true })
                    .on('data', (chunk) => outputBuffer.push(chunk))
                    .on('end', async () => {
                        try {
                            const finalBuffer = Buffer.concat(outputBuffer);
                            const uploadResult = await uploadImageToCloudinary(finalBuffer, abortSignal);
                            // const uploadResult = await uploadImageToCloudinary(coverImagePath, abortSignal);
                            resolve(uploadResult.success ? uploadResult.url : FALLBACK_IMAGE_URL);
                        } catch (uploadError) {
                            backendLogger.warn('Error uploading cover image', { uploadError });
                            resolve(FALLBACK_IMAGE_URL);
                        }
                    })
                    .on('error', (extractError) => {
                        backendLogger.warn('Error extracting cover image', { extractError });
                        resolve(FALLBACK_IMAGE_URL);
                    });
            }).catch((error) => {
                backendLogger.error('Error during cover image processing', { error });
                return FALLBACK_IMAGE_URL;
            }));

        return { success: true, metadata, coverImage: coverImage || FALLBACK_IMAGE_URL };
    } catch (error) {
        backendLogger.error('Error processing metadata extraction', { error });
        return { success: false, message: error.message, error };
    }
};

export const editAudioMetadata = async (fileUrl, fileExtension, metadata, coverImagePath) => {
    const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);

    try {
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
                .on('error', (processError) => {
                    backendLogger.error('Error during metadata editing', { processError });
                    reject({ success: false, message: 'Failed to edit metadata.', error: processError });
                })
                .on('end', resolve)
                .on('error', (processError) => {
                    backendLogger.error('Error during metadata editing', { processError });
                    reject({ success: false, message: 'Failed to edit metadata.', error: processError });
                });
        });

        const uploadResult = await uploadAudioToCloudinary(outputFilePath);

        if (uploadResult.success) {
            return { success: true, url: uploadResult.url };
        } else {
            throw { success: false, message: 'Failed to upload the edited file.', error: uploadResult.error };
        }
    } catch (error) {
        backendLogger.error('Unexpected error in editAudioMetadata function', { error });
        return { success: false, message: error.message, error };
    }
};
