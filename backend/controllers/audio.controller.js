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

    if (!editResult.success) {
        return errorResponse(res, editResult.message, editResult.error);
    }

    res.download(editResult.fileUrl, `edited_audio${fileExt}`, (err) => {
        if (err) {
            return errorResponse(res, 'Failed to download the edited file.', err);
        } else {
            setTimeout(() => cleanupFiles([editResult.fileUrl]), 20 * 60 * 1000); // Deletes after 20 minutes
        }
    });

    cleanupFiles([fileTempUrl, coverUrl?.path, req.file?.path]);
});

export const handleConvertAudio = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const { format, quality } = req.body;
    console.log({ format, quality, length: req.files.length });

    if (!format || !quality) {
        return errorResponse(
            res,
            'Format or quality is missing. Please provide a valid format and quality to convert the audio.',
            null,
            400
        );
    }

    const convertedFiles = [];
    const targetFormat = format.toLowerCase();

    // Convert all uploaded files
    for (const file of req.files) {
        console.log('Converting file:', file);

        const { success, fileUrl } = await convertAudioFormat(file.path, file?.originalname, targetFormat, quality);
        if (success) convertedFiles.push(fileUrl);
        cleanupFiles([file.path]);
    }

    if (convertedFiles.length === 0) {
        return res.status(500).json({ success: false, message: 'Conversion failed for all files' });
    }

    // Create ZIP file
    const zipFilePath = getTempPath('zip', `converted_${Date.now()}.zip`);
    await createDirectoryIfNotExists(getTempPath('zip'));
    await createZipFile(convertedFiles, zipFilePath);

    // Delete converted files after zipping
    cleanupFiles(convertedFiles);

    // Send ZIP file as response
    res.download(zipFilePath, `converted_${Date.now()}.zip`, (err) => {
        if (err) {
            console.error('Error sending ZIP file:', err);
            res.status(500).json({ success: false, message: 'Failed to send zip file' });
        } else {
            // Delete zip file after download
            setTimeout(() => cleanupFiles([zipFilePath]), 60 * 1000); // Deletes after 1 minute
        }
    });
});
