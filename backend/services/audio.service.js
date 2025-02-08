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
    try {
        const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);
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

        console.log('Selected AAC encoder:', aacEncoder);
        console.log('Converting audio file:', { fileUrl, targetFormat, bitrate });
        console.log(options);

        const command = ffmpeg(fileUrl);

        if (targetFormat === 'm4a') {
            command.audioCodec(aacEncoder).videoCodec('copy').outputOptions('-metadata:s:v', 'comment=Cover (front)');
        }

        // Audio Channels (No Change)
        if (options.audio.channels !== 'no change') {
            console.log('Setting audio channels:', options.audio.channels);
            command.audioChannels(parseInt(options.audio.channels));
        }

        // Volume Adjustment (92% = -0.7 dB)
        if (options.audio.volume !== 100) {
            console.log('Setting audio volume:', options.audio.volume);
            const volumeDb = 20 * Math.log10(options.audio.volume / 100);
            command.audioFilters(`volume=${volumeDb}dB`);
        }

        // Sample Rate (Default: 44100 Hz)
        if (options.audio.sampleRate) {
            console.log('Setting audio sample rate:', options.audio.sampleRate);
            const sampleRate = parseInt(options.audio.sampleRate);
            command.audioFrequency(sampleRate);
        }

        // Fade In & Fade Out
        if (options.effects.fadeIn) {
            console.log('Setting audio fade in:', options.effects.fadeIn);
            command.audioFilters(`afade=t=in:ss=0:d=${options.effects.fadeIn}`);
        }

        if (options.effects.fadeOut) {
            const audioDuration = await getAudioDuration(fileUrl);
            console.log('Setting audio fade out:', options.effects.fadeOut);
            console.log('Audio Duration:', audioDuration);
            const fadeOutStart = Math.max(0, audioDuration - options.effects.fadeOut);
            command.audioFilters(`afade=t=out:st=${fadeOutStart}:d=${options.effects.fadeOut}`);
        }

        // Playback Speed Adjustment (Default: 1.0x)
        if (options.effects.playbackSpeed && options.effects.playbackSpeed !== '1.0x (Normal)') {
            console.log('Setting audio playback speed:', options.effects.playbackSpeed);
            const speed = parseFloat(options.effects.playbackSpeed.replace('x', ''));
            command.audioFilters(`atempo=${speed}`);
        }

        // Pitch Shift (If defined)
        if (options.effects.pitchShift) {
            console.log('Setting audio pitch shift:', options.effects.pitchShift);
            command.audioFilters(`asetrate=${options.effects.pitchShift}`);
        }

        // Normalize Audio
        if (options.effects.normalize) {
            console.log('Normalizing audio...');
            command.audioFilters('loudnorm');
        }

        // Trim Audio (Start & End)
        if (options.trim.trimStart) {
            console.log('Trimming audio start:', options.trim.trimStart);
            command.setStartTime(options.trim.trimStart);
        }
        if (options.trim.trimEnd) {
            console.log('Trimming audio end:', options.trim.trimEnd);
            command.setDuration(options.trim.trimEnd);
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
