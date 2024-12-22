import { existsSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { processAudioMetadata, editMetadata } from '../services/audio.service.js';
import { backendLogger } from '../utils/logger.utils.js';
import { cleanupFile } from '../utils/pathAndFile.utils.js';
import { downloadAudioFromCloudinary, uploadAudioToCloudinary } from '../services/cloudinary.service.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

export const handleAudioUpload = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded. Please upload an audio file.', null, 400);
        }

        const uploadResult = await uploadAudioToCloudinary(req.file.path);
        cleanupFile(req.file.path);

        if (!uploadResult.success) {
            return errorResponse(res, 'Error uploading audio file. Please try again later.', uploadResult.error);
        }
        return successResponse(res, { publicId: uploadResult.publicId, url: uploadResult.url });
    } catch (error) {
        cleanupFile(req.file?.path);
        return errorResponse(res, 'Internal server error. Please try again later.', error);
    }
};

export const handleExtractMetadata = async (req, res) => {
    try {
        const { fileId } = req.body;
        let fileUrl = req.body.fileUrl;

        if (!(fileId || fileUrl)) {
            return errorResponse(res, 'Missing file in request.', null, 400);
        }

        const controller = new AbortController();
        // ToDO: Implement cancellation logic

        // req.on('close', () => {
        //     console.log('close');
        // });

        // req.on('aborted', () => {
        //     console.log('aborted');
        // });

        if (!fileUrl) {
            const fileResult = await downloadAudioFromCloudinary(fileId, controller.signal);
            if (!fileResult.success) {
                return errorResponse(res, 'Something went wrong.', fileResult);
            }
            fileUrl = fileResult.url;
        }

        const metadataResult = await processAudioMetadata(fileUrl, controller.signal);

        if (!metadataResult.success) {
            return errorResponse(res, 'Error Extracting metadata.', metadataResult);
        }

        return successResponse(res, { ...metadataResult });
    } catch (error) {
        return errorResponse(res, 'Internal server error.', error);
    }
};

export const handleEditMetadata = async (req, res) => {
    try {
        const { fileId, metadata } = req.body;

        if (!fileId) {
            return errorResponse(res, 'File name is required for metadata editing.', null, 400);
        }

        if (!existsSync(originalFilePath)) {
            return errorResponse(res, 'Audio file not found. Please re-upload the file.', null, 404);
        }

        const editResult = await editMetadata(metadata, originalFilePath, editedFilePath);

        if (!editResult.success) {
            return errorResponse(res, editResult.message);
        }

        res.download(editedFilePath, (err) => {
            if (err) {
                return errorResponse(res, 'File download failed. Please try again later.', err);
            }

            // Cleanup original and edited files after download
            try {
                if (existsSync(originalFilePath)) unlinkSync(originalFilePath);
                if (existsSync(editedFilePath)) unlinkSync(editedFilePath);
            } catch (cleanupError) {}
        });
    } catch (error) {
        return errorResponse(res, 'Internal server error. Please try again later.', error);
    }
};
