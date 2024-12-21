import cloudinary from '../config/cloudinary.config.js';

export const uploadImageToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: 'uploads',
        });
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error uploading image to Cloudinary',
            error,
        };
    }
};
