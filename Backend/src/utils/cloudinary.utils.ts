import cloudinary from '../config/cloudinary';
import logger from './logger';
import { AppError } from '../middleware/errorHandler';

interface UploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  public_id?: string;
}

/**
 * Upload image to Cloudinary from base64 string
 */
export const uploadImageToCloudinary = async (
  base64Image: string,
  options: UploadOptions = {}
): Promise<any> => {
  try {
    const defaultOptions = {
      folder: options.folder || 'rass-engineering',
      resource_type: options.resource_type || 'auto' as const,
      transformation: options.transformation || [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    const result = await cloudinary.uploader.upload(base64Image, {
      ...defaultOptions,
      ...options
    });

    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes
    };
  } catch (error: any) {
    logger.error('Cloudinary upload error:', error);
    throw new AppError(`Failed to upload image: ${error.message}`, 500);
  }
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleImages = async (
  base64Images: string[],
  options: UploadOptions = {}
): Promise<any[]> => {
  try {
    const uploadPromises = base64Images.map(image => 
      uploadImageToCloudinary(image, options)
    );

    const results = await Promise.all(uploadPromises);
    logger.info(`${results.length} images uploaded to Cloudinary`);

    return results;
  } catch (error: any) {
    logger.error('Multiple images upload error:', error);
    throw new AppError(`Failed to upload images: ${error.message}`, 500);
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok' || result.result === 'not found') {
      logger.info(`Image deleted from Cloudinary: ${publicId} - ${result.result}`);
      return { success: true, publicId, result: result.result };
    } else {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
  } catch (error: any) {
    logger.error('Cloudinary delete error:', error);
    throw new AppError(`Failed to delete image: ${error.message}`, 500);
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteMultipleImages = async (publicIds: string[]): Promise<any> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    logger.info(`${publicIds.length} images deleted from Cloudinary`);
    return result;
  } catch (error: any) {
    logger.error('Multiple images delete error:', error);
    throw new AppError(`Failed to delete images: ${error.message}`, 500);
  }
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
};

/**
 * Extract public_id from Cloudinary URL - FIXED VERSION
 * Example URL: https://res.cloudinary.com/des8j9zc6/image/upload/v1766736571/rass-engineering/about/ybscxuoqo5eipz32ki1l.jpg
 * Should return: rass-engineering/about/ybscxuoqo5eipz32ki1l
 */
export const extractPublicIdFromUrl = (cloudinaryUrl: string): string | null => {
  try {
    // Remove any query parameters first
    const urlWithoutParams = cloudinaryUrl.split('?')[0];
    
    // Split by '/'
    const urlParts = urlWithoutParams.split('/');
    
    // Find the 'upload' index
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      logger.error('Invalid Cloudinary URL - no "upload" segment found:', cloudinaryUrl);
      return null;
    }

    // Get everything after 'upload/v123456789/' (skip version)
    const startIndex = uploadIndex + 2; // Skip 'upload' and version 'v123456789'
    
    if (startIndex >= urlParts.length) {
      logger.error('Invalid Cloudinary URL - no path after version:', cloudinaryUrl);
      return null;
    }
    
    // Join the remaining parts
    const pathWithExtension = urlParts.slice(startIndex).join('/');
    
    // Remove file extension (e.g., .jpg, .png)
    const publicId = pathWithExtension.replace(/\.[^/.]+$/, '');
    
    logger.info(`Extracted public_id: ${publicId} from URL: ${cloudinaryUrl}`);
    
    return publicId;
  } catch (error) {
    logger.error('Error extracting public_id from URL:', error);
    return null;
  }
};

/**
 * Upload image from URL to Cloudinary
 */
export const uploadImageFromUrl = async (
  imageUrl: string,
  options: UploadOptions = {}
): Promise<any> => {
  try {
    const defaultOptions = {
      folder: options.folder || 'rass-engineering',
      resource_type: 'auto' as const
    };

    const result = await cloudinary.uploader.upload(imageUrl, {
      ...defaultOptions,
      ...options
    });

    logger.info(`Image uploaded from URL to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error: any) {
    logger.error('Cloudinary upload from URL error:', error);
    throw new AppError(`Failed to upload image from URL: ${error.message}`, 500);
  }
};

/**
 * Get folder contents from Cloudinary
 */
export const getFolderContents = async (folderPath: string = 'rass-engineering'): Promise<any> => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: 500
    });

    logger.info(`Retrieved ${result.resources.length} resources from folder: ${folderPath}`);
    return result.resources;
  } catch (error: any) {
    logger.error('Error getting folder contents:', error);
    throw new AppError(`Failed to get folder contents: ${error.message}`, 500);
  }
};

/**
 * Create a Cloudinary folder
 */
export const createFolder = async (folderName: string): Promise<void> => {
  try {
    await cloudinary.api.create_folder(folderName);
    logger.info(`Folder created: ${folderName}`);
  } catch (error: any) {
    if (error.error?.message?.includes('already exists')) {
      logger.info(`Folder already exists: ${folderName}`);
    } else {
      logger.error('Error creating folder:', error);
      throw new AppError(`Failed to create folder: ${error.message}`, 500);
    }
  }
};

export default {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  deleteMultipleImages,
  getOptimizedImageUrl,
  extractPublicIdFromUrl,
  uploadImageFromUrl,
  getFolderContents,
  createFolder
};