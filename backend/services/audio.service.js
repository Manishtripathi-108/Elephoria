import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { backendLogger } from '../utils/logger.utils.js';
import { uploadImageToCloudinary } from './cloudinary.service.js';
import { cleanupFile, createDirectoryIfNotExists, getTempPath } from '../utils/path.utils.js';

export const processAudioUpload = async (file, abortToken) => {
    const noImage = 'https://res.cloudinary.com/dra73suxl/image/upload/v1734726129/uploads/rnarvvwmsgqt5rs8okds.png';
    let metadata,
        coverImage = noImage;

    const tempDir = getTempPath('images');
    const coverImagePath = `${tempDir}/cover_${Date.now()}.jpg`;
    console.log('Cover Image Path:', coverImagePath);

    try {
        await createDirectoryIfNotExists(tempDir);

        console.log('start processing audio upload');

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
                        const result = await uploadImageToCloudinary(coverImagePath, abortToken);
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
        if (file.path) cleanupFile(file.path);
        if (coverImagePath) cleanupFile(coverImagePath);
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
