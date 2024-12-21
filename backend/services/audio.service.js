import ffmpeg from 'fluent-ffmpeg';
import { join, resolve } from 'path';
import { exec } from 'child_process';
import { backendLogger } from '../utils/logger.utils.js';
import { uploadImageToCloudinary } from './cloudinary.service.js';

export const processAudioUpload = async (file) => {
    const noImage = `https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png`;
    let metadata,
        coverImage = noImage;

    try {
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
        metadata.format?.tags ? (metadata.format.tags.lyrics = lyrics) : (metadata.format = { tags: { lyrics } });

        const coverStream = metadata.streams?.find(
            (stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video'
        );

        if (coverStream) {
            const coverImagePath = join(resolve('./uploads/images'), `cover_${Date.now()}.jpg`);
            coverImage = await new Promise((resolve) => {
                ffmpeg(file.path)
                    .outputOptions('-map', `0:${coverStream.index}`)
                    .save(coverImagePath)
                    .on('end', async () => {
                        const result = await uploadImageToCloudinary(coverImagePath);
                        resolve(result.success ? result.url : noImage);
                    })
                    .on('error', (error) => {
                        backendLogger.warn('Error extracting cover image:', error);
                        resolve(noImage);
                    });
            });
        }

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
