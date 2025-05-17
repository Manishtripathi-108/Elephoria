import { backendLogger } from '../utils/logger.utils.js';
import { cleanupFiles, createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';
import { uploadImageToCloudinary } from './cloudinary.service.js';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

// Constants
const FALLBACK_IMAGE_URL =
    'https://res.cloudinary.com/dra73suxl/image/upload/v1744229654/no_cover_image_fallback_jhsdj.png';

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
 * Retrieves the duration of an audio file in seconds.
 * @param {string} filePath - Local path to the audio file.
 * @returns {Promise<number>} - Duration of the audio file in seconds.
 */
const getAudioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                resolve(metadata.format.duration); // Get total duration in seconds
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
    const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);
    try {
        await createDirectoryIfNotExists(getTempPath('audio'));

        const command = ffmpeg(fileUrl);

        // Attach cover image if provided
        if (coverImagePath) {
            command
                .input(coverImagePath)
                .outputOptions('-map', '0:a', '-map', '1', '-disposition:v', 'attached_pic')
                .outputOptions('-metadata:s:v', 'comment=Cover (front)');
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
    } finally {
        setTimeout(() => cleanupFiles([outputFilePath]), process.env.TEMP_FILE_DELETE_DELAY);
    }
};

/**
 * Converts an audio file to a target format.
 * @param {string} fileUrl - URL of the audio file to convert.
 * @param {string} [fileName] - Name of the output file (without extension).
 * @param {string} [targetFormat='m4a'] - Target format of the output file.
 * @param {number} [bitrate=192] - Bitrate to use for the output file (in kbps).
 * @param {number} [frequency=44100] - Sample frequency to use for the output file (in Hz).
 * @returns {Promise<{success: boolean, fileUrl?: string, message?: string, error?: object}>}
 */
export const convertAudioFormat = async (fileUrl, fileName, targetFormat = 'm4a', bitrate = 192, options) => {
    try {
        const outputFilePath = getTempPath(
            'audio',
            `converted_${fileName.split('.')[0] || `${Date.now()}`}.${targetFormat}`
        );
        await createDirectoryIfNotExists(getTempPath('audio'));

        console.log('Converting audio file:', { fileUrl, targetFormat, bitrate });
        console.log(options);

        const command = ffmpeg(fileUrl);

        if (targetFormat === 'm4a') {
            console.log('Checking available encoders...');
            const encoders = await new Promise((resolve, reject) => {
                ffmpeg().availableEncoders((err, encoders) => {
                    if (err) return reject(err);
                    resolve(encoders);
                });
            });

            // Determine the best available AAC encoder
            let aacEncoder = 'aac'; // Default to 'aac' if nothing else is available
            if (encoders.aac_at) {
                aacEncoder = 'aac_at';
            } else if (encoders.libfdk_aac) {
                aacEncoder = 'libfdk_aac';
            }
            command.audioCodec(aacEncoder).videoCodec('copy').outputOptions('-metadata:s:v', 'comment=Cover (front)');
        }

        const channels = parseInt(options?.audio?.channels);
        if (channels && channels > 0) command.audioChannels(channels);

        // Volume Adjustment (92% = -0.7 dB)
        if (options?.audio?.volume && options?.audio?.volume !== 100) {
            console.log('Adjusting volume:', options.audio.volume);
            const volumeDb = 20 * Math.log10(options.audio.volume / 100);
            command.audioFilters(`volume=${volumeDb}dB`);
        }

        // Sample Rate
        const sampleRate = parseInt(options?.audio?.sampleRate);
        if (sampleRate) {
            console.log('Setting sample rate:', sampleRate);
            command.audioFrequency(sampleRate);
        }

        // Effects
        const { fadeIn, fadeOut, playbackSpeed, pitchShift, normalize } = options?.effects || {};

        if (fadeIn && fadeIn !== 0) command.audioFilters(`afade=t=in:ss=0:d=${options.effects.fadeIn}`);

        if (fadeOut && fadeOut !== 0) {
            console.log('Adding fade out effect:', fadeOut);
            const duration = await getAudioDuration(fileUrl);
            const fadeStart = Math.max(0, duration - fadeOut);
            command.audioFilters(`afade=t=out:st=${fadeStart}:d=${options.effects.fadeOut}`);
        }

        if (playbackSpeed && playbackSpeed !== '1.0x (Normal)') {
            console.log('Setting playback speed:', parseFloat(playbackSpeed));
            command.audioFilters(`atempo=${parseFloat(playbackSpeed)}`);
        }

        if (pitchShift && pitchShift !== 0) {
            console.log('Setting pitch shift:', pitchShift);
            command.audioFilters(`asetrate=${pitchShift}`);
        }

        if (normalize) command.audioFilters('loudnorm');

        // Trim
        const { trimStart, trimEnd } = options?.trim || {};
        if (trimStart && trimStart !== '00:00:00') {
            console.log('Trimming start time:', trimStart);
            command.setStartTime(trimStart);
        }
        if (trimEnd && trimEnd !== '00:00:00') {
            console.log('Trimming end time:', trimEnd);
            command.setDuration(trimEnd);
        }

        await new Promise((resolve, reject) => {
            command
                .audioBitrate(bitrate)
                .save(outputFilePath)
                .on('end', resolve)
                .on('error', (error) => reject(error));
        });

        return { success: true, fileUrl: outputFilePath };
    } catch (error) {
        backendLogger.error('Unexpected error in convertAudioFormat', error);
        return { success: false, message: 'Failed to convert audio format', error };
    }
};
