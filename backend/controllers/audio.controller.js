import { extractAudioMetadata, editAudioMetadata } from '../services/audio.service.js';
import {
    downloadAudioFromCloudinary,
    uploadAudioToCloudinary,
    uploadImageToCloudinary,
} from '../services/cloudinary.service.js';
import { backendLogger } from '../utils/logger.utils.js';
import { cleanupFile, getTempPath } from '../utils/pathAndFile.utils.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { resizeAndCropImage } from '../utils/sharp.utils.js';
import { extname } from 'path';

export const handleAudioUpload = async (req, res) => {
    try {
        // * Change the code here (if not using Buffer)
        const file = req.file.buffer;

        if (!file) {
            return errorResponse(res, 'No file uploaded. Please upload a valid audio file.', null, 400);
        }

        const uploadResult = await uploadAudioToCloudinary(file);

        if (!uploadResult.success) {
            return errorResponse(res, 'Failed to upload the audio file. Please try again.', uploadResult.error);
        }

        return successResponse(res, { publicId: uploadResult.publicId, url: uploadResult.url });
    } catch (error) {
        req.file?.path ? cleanupFile(req.file?.path) : null;
        return errorResponse(res, 'Unexpected error occurred while uploading. Please try again.', error);
    }
};

export const handleExtractMetadata = async (req, res) => {
    try {
        // Get file details from the request body
        const { audioFileId, audioFileUrl } = req.body;

        if (!audioFileId && !audioFileUrl) {
            return errorResponse(res, 'File details are missing. Please provide a valid file to process.', null, 400);
        }

        const controller = new AbortController();

        // TODO: Implement cancellation logic
        // This would involve listening for the 'close' or 'aborted' events on the request object
        // and calling controller.abort() to cancel the extraction process

        // req.on('close', () => {
        //     console.log('close');
        // });

        // req.on('aborted', () => {
        //     console.log('aborted');
        // });

        let fileDownloadUrl = audioFileUrl;
        if (!audioFileUrl) {
            const downloadResult = await downloadAudioFromCloudinary(audioFileId, controller.signal);
            if (!downloadResult.success) {
                return errorResponse(res, 'Failed to retrieve the file. Please try again.', downloadResult.error);
            }
            fileDownloadUrl = downloadResult.url;
        }

        const metadataResult = await extractAudioMetadata(fileDownloadUrl, controller.signal);
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
        const { audioFileId, audioFileUrl } = req.body;
        const metadata = typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata;

        // Validate audio file information
        if (!audioFileId && !audioFileUrl) {
            return errorResponse(
                res,
                'File details are missing. Please provide a valid file to edit metadata.',
                null,
                400
            );
        }

        // Download audio file if URL is not provided
        const fileDownloadUrl = audioFileUrl || (await downloadAudioFromCloudinary(audioFileId)).url;

        if (!fileDownloadUrl) {
            return errorResponse(res, 'Failed to retrieve the file. Please try again.', null, 500);
        }

        const fileExtension = extname(fileDownloadUrl);

        // * Change the code here (if not using Buffer): { resizeAndCropImage(req.file.path, false, getTempPath('images', `cover_${Date.now()}.jpg`)).path }
        const coverImage = req.file ? await resizeAndCropImage(req.file.buffer, true) : null;
        const coverUrl = coverImage ? await uploadImageToCloudinary(coverImage) : null;

        // Edit metadata
        const editResult = await editAudioMetadata(fileDownloadUrl, fileExtension, metadata, coverUrl);

        if (!editResult.success) {
            return errorResponse(res, 'Failed to edit metadata. Please try again.', editResult.error);
        }

        return successResponse(res, { editedFileUrl: editResult.url });
    } catch (error) {
        req.file?.path ? cleanupFile(req.file?.path) : null;
        return errorResponse(res, 'Unexpected error occurred while editing metadata. Please try again.', error);
    }
};
