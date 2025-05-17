import { extractAudioMetadata, editAudioMetadata, convertAudioFormat } from '../services/audio.service.js';
import { createZipFile } from '../utils/archiver.utils.js';
import { asyncHandler } from '../utils/errorHandler.utils.js';
import { cleanupFiles, createDirectoryIfNotExists, getTempPath } from '../utils/pathAndFile.utils.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { resizeAndCropImage } from '../utils/sharp.utils.js';
import { existsSync } from 'fs';
import { extname } from 'path';

export const handleExtractMetadata = asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
        return errorResponse(res, 'No file uploaded. Please upload a valid audio file.', null, 400);
    }

    // TODO: Implement cancellation logic
    // const controller = new AbortController();
    // This would involve listening for the 'close' or 'aborted' events on the request object
    // and calling controller.abort() to cancel the extraction process

    // req.on('close', () => {
    //     console.log('close');
    // });

    // req.on('aborted', () => {
    //     console.log('aborted');
    // });

    const metadataResult = await extractAudioMetadata(file.path);
    if (!metadataResult.success) {
        return errorResponse(res, metadataResult.message, metadataResult.error);
    }

    return successResponse(res, { ...metadataResult, audioFileName: file.filename });
});

export const handleEditMetadata = asyncHandler(async (req, res) => {
    const audioFileName = req.body.audioFileName;
    const metadata = typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata;

    // Validate audio file information
    if (!audioFileName || !metadata) {
        return errorResponse(
            res,
            'Audio file or metadata is missing. Please provide a valid audio file and metadata to edit.',
            null,
            400
        );
    }

    const fileTempUrl = getTempPath('audio', audioFileName);

    if (!existsSync(fileTempUrl)) {
        return errorResponse(res, 'Audio file not found. Please reupload a valid audio file.', null, 404);
    }

    const fileExt = extname(audioFileName);

    const coverUrl = req.file
        ? await resizeAndCropImage(req.file.path, false, getTempPath('images', `cover_${Date.now()}.jpg`))
        : null;

    const editResult = await editAudioMetadata(fileTempUrl, fileExt, metadata, coverUrl?.path);
    cleanupFiles([coverUrl?.path, req.file?.path]);

    if (!editResult.success) {
        return errorResponse(res, editResult.message, editResult.error);
    }

    res.download(editResult.fileUrl, `edited_audio${fileExt}`, (err) => {
        if (err) {
            return errorResponse(res, 'Failed to download the edited file.', err);
        }
    });
    cleanupFiles([fileTempUrl]);
});

export const handleConvertAudio = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'No files uploaded. Please upload valid audio files to convert.', null, 400);
    }

    const { formats, qualities, advanceSettings } = req.body;

    if (!formats) {
        return errorResponse(res, 'Format is missing. Please provide a valid format to convert the audio.', null, 400);
    }

    let downloadFilePath = null;

    // Convert each file
    if (req.files.length === 1) {
        const { success, fileUrl } = await convertAudioFormat(
            req.files[0].path,
            req.files[0]?.originalname,
            formats?.toLowerCase(),
            parseInt(qualities),
            advanceSettings ? JSON.parse(advanceSettings) : {}
        );
        if (success) downloadFilePath = fileUrl;
        cleanupFiles([req.files[0].path]);
    } else {
        const convertedFiles = [];

        await Promise.all(
            req.files.map(async (file, index) => {
                const { success, fileUrl } = await convertAudioFormat(
                    file.path,
                    file?.originalname,
                    formats[index]?.toLowerCase(),
                    parseInt(qualities[index]),
                    advanceSettings[index] ? JSON.parse(advanceSettings[index]) : {}
                );
                if (success) convertedFiles.push(fileUrl);
                cleanupFiles([file.path]);
            })
        );

        if (convertedFiles.length === 0) {
            return errorResponse(res, 'Failed to convert any files', null, 500);
        }

        // Create ZIP file
        downloadFilePath = getTempPath('zip', `converted_${Date.now()}.zip`);
        await createDirectoryIfNotExists(getTempPath('zip'));
        await createZipFile(convertedFiles, downloadFilePath);

        // Delete converted files after zipping
        cleanupFiles(convertedFiles);
    }

    // Send file as response
    if (downloadFilePath) {
        res.download(
            downloadFilePath,
            `converted_${req.files.length === 1 ? req.files[0].originalname.replace(/\.[^/.]+$/, '') : 'files'}`,
            (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    return errorResponse(res, 'Failed to send the converted file.', err);
                } else {
                    setTimeout(() => cleanupFiles([downloadFilePath]), process.env.TEMP_FILE_DELETE_DELAY);
                }
            }
        );
    } else {
        return errorResponse(res, 'Failed to create zip file', downloadFilePath, 500);
    }
});
