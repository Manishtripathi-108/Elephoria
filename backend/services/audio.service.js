import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { backendLogger } from '../utils/logger.utils.js';
import { uploadImageToCloudinary } from './cloudinary.service.js';
import { createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';

/**
 * Processes an audio file to extract metadata, lyrics, and cover image.
 *
 * @param {Object} file - An Express.js file object containing the audio file to process.
 * @param {Object} abortSignal - An AbortController token to cancel the process if needed.
 * @returns {Promise<{success: boolean, fileName?: string, metadata?: object, coverImage?: string, error?: Error}>} - A promise resolving to an object indicating success, extracted metadata, lyrics, and cover image URL.
 * If successful, includes the original file name, metadata, and cover image URL. If failed, includes error information.
 *
 * @example
 * const result = await processAudioMetadata(req.file, abortControllerRef.current.signal);
 * if (result.success) {
 *   console.log('Metadata:', result.metadata);
 *   console.log('Cover Image:', result.coverImage);
 * } else {
 *   console.error('Error processing metadata:', result.error);
 * }
 */
export const processAudioMetadata = async (file, abortSignal) => {
    const noImage = 'https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png';
    let metadata,
        coverImage = noImage;

    const tempDir = getTempPath('images');
    const coverImagePath = `${tempDir}/cover_${Date.now()}.jpg`;
    console.log('Cover Image Path:', coverImagePath);

    try {
        await createDirectoryIfNotExists(tempDir);

        console.log('start processing audio metadata');

        // Extract metadata from the uploaded audio file
        metadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file.path, (error, extractedMetadata) => {
                if (error) {
                    return reject({
                        success: false,
                        message: 'Error extracting metadata',
                        error: error?.toString(),
                    });
                }
                resolve(extractedMetadata);
            });
        });

        console.log('extracted');

        // Extract lyrics
        const lyrics = await new Promise((resolve) => {
            const ffprobeCmd = `ffprobe -i "${file.path}" -show_entries format_tags=lyrics -of json`;
            exec(ffprobeCmd, (error, stdout) => {
                if (error) {
                    backendLogger.warn('Error extracting lyrics:', error);
                    resolve('No lyrics found');
                }
                try {
                    const lyrics = JSON.parse(stdout).format?.tags?.lyrics || 'No lyrics found';
                    resolve(lyrics);
                } catch (parseError) {
                    resolve('No lyrics found');
                }
            });
        });

        // Append lyrics to the metadata object
        metadata.format = { ...(metadata.format || {}), tags: { ...metadata.format?.tags, lyrics } };

        console.log('lyrics');

        const coverStream = metadata.streams?.find(
            (stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video'
        );

        if (coverStream) {
            coverImage = await new Promise((resolve) => {
                ffmpeg(file.path)
                    .outputOptions('-map', `0:${coverStream.index}`)
                    .save(coverImagePath)
                    .on('end', async () => {
                        const result = await uploadImageToCloudinary(coverImagePath, abortSignal);
                        resolve(result.success ? result.url : noImage);
                    })
                    .on('error', (error) => {
                        backendLogger.warn('Error extracting cover image:', error);
                        resolve(noImage);
                    });
            });
        }

        console.log('completed');

        return {
            success: true,
            fileName: file.originalname,
            metadata,
            coverImage,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error processing the file',
            error: error.error || error,
        };
    }
};

/**
 * Edits the metadata of an audio file using FFmpeg.
 *
 * @param {Object} metadata Object containing the metadata key-value pairs.
 * @param {string} inputFilePath Path to the input audio file.
 * @param {string} outputFilePath Path to the output audio file with the edited metadata.
 *
 * @returns {Promise} A promise that resolves with { success: true } if successful, or rejects with { success: false, message, error } if an error occurs.
 * @example
 * const result = await editMetadata(metadata, inputFilePath, outputFilePath);
 * if (result.success) {
 *  console.log('Metadata edited successfully!');
 * }
 * else {
 * console.error('Error editing metadata:', result.error);
 * }
 */
export const editMetadata = (metadata, inputFilePath, outputFilePath) => {
    return new Promise((resolve, reject) => {
        const command = ffmpeg(inputFilePath);
        backendLogger.info('Metadata: ', metadata);

        Object.entries(metadata).forEach(([key, value]) => {
            command.outputOptions('-metadata', `${key}=${value || ''}`);
        });

        command
            .outputOptions('-c copy') // Copy the stream without re-encoding
            .save(outputFilePath)
            .on('end', () => resolve({ success: true }))
            .on('error', (err) =>
                reject({
                    success: false,
                    message: 'Error processing the file',
                    error: err,
                })
            );
    });
};
