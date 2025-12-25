import cloudinary from '../config/cloudinary';
import { AppError } from '../middleware/errorHandler';

interface UploadResult {
  url: string;
  public_id: string;
}

// Upload image to Cloudinary
export const uploadImage = async (file: Express.Multer.File): Promise<UploadResult> => {
  try {
    // Convert buffer to base64
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'rass/uploads',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};

// Upload multiple images
export const uploadImages = async (files: Express.Multer.File[]): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new AppError('Failed to delete image', 500);
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  const matches = url.match(/\/v\d+\/([^/]+)\.\w+$/);
  return matches ? matches[1] : null;
};