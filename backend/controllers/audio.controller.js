import { existsSync, unlinkSync } from 'fs';
import { extname, join, resolve } from 'path';
import { extractMetadata, editMetadata } from '../services/audio.service.js';
import { backendLogger } from '../utils/logger.utils.js';
import { cleanupFile } from '../utils/pathAndFile.utils.js';
import { downloadAudioFromCloudinary, uploadAudioToCloudinary } from '../services/cloudinary.service.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

export const handleAudioUpload = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded. Please upload a valid audio file.', null, 400);
        }

        const uploadResult = await uploadAudioToCloudinary(req.file.path);
        cleanupFile(req.file.path);

        if (!uploadResult.success) {
            return errorResponse(res, 'Failed to upload the audio file. Please try again.', uploadResult.error);
        }

        return successResponse(res, { publicId: uploadResult.publicId, url: uploadResult.url });
    } catch (error) {
        cleanupFile(req.file?.path);
        return errorResponse(res, 'Unexpected error occurred while uploading. Please try again.', error);
    }
};

export const handleExtractMetadata = async (req, res) => {
    try {
        const { fileId, fileUrl } = req.body;

        if (!fileId && !fileUrl) {
            return errorResponse(res, 'File details are missing. Please provide a valid file to process.', null, 400);
        }

        const controller = new AbortController();
        // ToDO: Implement cancellation logic

        // req.on('close', () => {
        //     console.log('close');
        // });

        // req.on('aborted', () => {
        //     console.log('aborted');
        // });

        let fileDownloadUrl = fileUrl;
        if (!fileUrl) {
            const downloadResult = await downloadAudioFromCloudinary(fileId, controller.signal);
            if (!downloadResult.success) {
                return errorResponse(res, 'Failed to retrieve the file. Please try again.', downloadResult.error);
            }
            fileDownloadUrl = downloadResult.url;
        }

        const metadataResult = await extractMetadata(fileDownloadUrl, controller.signal);
        if (!metadataResult.success) {
            return errorResponse(res, 'Failed to extract metadata. Please try again.', metadataResult.error);
        }

        return successResponse(res, { metadata: metadataResult.metadata, coverImage: metadataResult.coverImage });
    } catch (error) {
        return errorResponse(res, 'Unexpected error occurred while extracting metadata. Please try again.', error);
    }
};

export const handleEditMetadata = async (req, res) => {
    try {
        const { fileId, fileUrl, metadata } = req.body;

        if (!fileId && !fileUrl) {
            return errorResponse(
                res,
                'File details are missing. Please provide a valid file to edit metadata.',
                null,
                400
            );
        }

        let fileDownloadUrl = fileUrl;
        if (!fileUrl) {
            const downloadResult = await downloadAudioFromCloudinary(fileId);
            if (!downloadResult.success) {
                return errorResponse(res, 'Failed to retrieve the file. Please try again.', downloadResult.error);
            }
            fileDownloadUrl = downloadResult.url;
        }

        const fileExtension = extname(fileDownloadUrl);
        const editResult = await editMetadata(fileDownloadUrl, metadata, fileExtension);

        if (!editResult.success) {
            return errorResponse(res, 'Failed to edit metadata. Please try again.', editResult.error);
        }

        return successResponse(res, { editedFileUrl: editResult.url });
    } catch (error) {
        return errorResponse(res, 'Unexpected error occurred while editing metadata. Please try again.', error);
    }
};
