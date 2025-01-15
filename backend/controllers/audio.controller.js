import { extractAudioMetadata, editAudioMetadata } from '../services/audio.service.js';
import { getTempPath } from '../utils/pathAndFile.utils.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { resizeAndCropImage } from '../utils/sharp.utils.js';
import { existsSync } from 'fs';
import { extname } from 'path';

export const handleExtractMetadata = async (req, res) => {
    try {
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
    } catch (error) {
        return errorResponse(res, 'Unexpected error occurred while extracting metadata. Please try again.', error);
    }
};

export const handleEditMetadata = async (req, res) => {
    try {
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

        // return successResponse(res, { editedFileUrl: editResult.fileUrl });
        res.download(editResult.fileUrl, `edited_audio${fileExt}`, (err) => {
            if (err) {
                return errorResponse(res, 'Failed to download the edited file.', err);
            }
        });
    } catch (error) {
        return errorResponse(res, 'Unexpected error occurred while editing metadata. Please try again.', error);
    }
};
