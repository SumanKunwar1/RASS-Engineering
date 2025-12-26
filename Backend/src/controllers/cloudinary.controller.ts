import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
  uploadImageFromUrl,
  getFolderContents
} from '../utils/cloudinary.utils';
import { validateBase64Image } from '../middleware/upload.middleware';
import logger from '../utils/logger';

// @desc    Upload single image (base64 or file)
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let base64Image: string;

  // Check multiple possible sources of the image
  if (req.body.imageBase64) {
    base64Image = req.body.imageBase64;
  } else if (req.body.image) {
    base64Image = req.body.image;
  } else {
    return next(new AppError('No image provided', 400));
  }

  // Validate base64 image
  if (!validateBase64Image(base64Image)) {
    return next(new AppError('Invalid image format. Please provide a valid image file', 400));
  }

  const folder = req.body.folder || 'rass-engineering/general';

  try {
    const result = await uploadImageToCloudinary(base64Image, { folder });

    logger.info(`Image uploaded by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: [result] // Return as array for consistency
    });
  } catch (error: any) {
    logger.error(`Upload error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to upload image', 500));
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let base64Images: string[];

  // Get images from multiple possible sources
  if (req.body.imagesBase64 && Array.isArray(req.body.imagesBase64)) {
    base64Images = req.body.imagesBase64;
  } else if (req.body.images && Array.isArray(req.body.images)) {
    base64Images = req.body.images;
  } else {
    return next(new AppError('No images provided', 400));
  }

  if (base64Images.length === 0) {
    return next(new AppError('No images provided', 400));
  }

  // Validate all images
  const invalidImages = base64Images.filter(img => !validateBase64Image(img));
  if (invalidImages.length > 0) {
    return next(new AppError(`${invalidImages.length} image(s) have invalid format`, 400));
  }

  const folder = req.body.folder || 'rass-engineering/general';

  try {
    const results = await uploadMultipleImages(base64Images, { folder });

    logger.info(`${results.length} images uploaded by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: `${results.length} image(s) uploaded successfully`,
      data: results
    });
  } catch (error: any) {
    logger.error(`Upload error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to upload images', 500));
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image
// @access  Private
export const deleteImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, publicId } = req.body;

  let imagePublicId: string | null;

  if (publicId) {
    imagePublicId = publicId;
  } else if (imageUrl) {
    imagePublicId = extractPublicIdFromUrl(imageUrl);
  } else {
    return next(new AppError('Please provide imageUrl or publicId', 400));
  }

  if (!imagePublicId) {
    return next(new AppError('Invalid image URL or publicId', 400));
  }

  try {
    await deleteImageFromCloudinary(imagePublicId);

    logger.info(`Image deleted by admin: ${req.user?.email || 'unknown'} - ${imagePublicId}`);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to delete image', 500));
  }
});

// @desc    Upload image from external URL
// @route   POST /api/upload/image-url
// @access  Private
export const uploadFromUrl = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, folder } = req.body;

  if (!imageUrl) {
    return next(new AppError('Please provide imageUrl', 400));
  }

  try {
    const result = await uploadImageFromUrl(imageUrl, {
      folder: folder || 'rass-engineering/general'
    });

    logger.info(`Image uploaded from URL by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully from URL',
      data: result
    });
  } catch (error: any) {
    logger.error(`Upload from URL error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to upload image from URL', 500));
  }
});

// @desc    Get all images from a folder
// @route   GET /api/upload/folder/:folderPath
// @access  Private
export const getImagesFromFolder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { folderPath } = req.params;

  try {
    const resources = await getFolderContents(folderPath || 'rass-engineering');

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources.map((resource: any) => ({
        url: resource.secure_url,
        publicId: resource.public_id,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        bytes: resource.bytes,
        createdAt: resource.created_at
      }))
    });
  } catch (error: any) {
    logger.error(`Fetch folder error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to fetch images', 500));
  }
});

// @desc    Upload hero section images
// @route   POST /api/upload/hero-images
// @access  Private
export const uploadHeroImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let base64Images: string[];

  // FIXED: Check for imagesBase64 field from multer
  if (req.body.imagesBase64 && Array.isArray(req.body.imagesBase64)) {
    base64Images = req.body.imagesBase64;
  } else if (req.body.images && Array.isArray(req.body.images)) {
    base64Images = req.body.images;
  } else {
    logger.error('Hero upload - No images found in request body', req.body);
    return next(new AppError('Please provide hero images', 400));
  }

  if (base64Images.length === 0) {
    return next(new AppError('Please provide at least one image', 400));
  }

  // Validate all images
  const invalidImages = base64Images.filter(img => !validateBase64Image(img));
  if (invalidImages.length > 0) {
    logger.error(`${invalidImages.length} invalid images found`);
    return next(new AppError(`${invalidImages.length} image(s) have invalid format`, 400));
  }

  try {
    // Upload to hero-images folder with optimizations
    const results = await uploadMultipleImages(base64Images, {
      folder: 'rass-engineering/hero-images',
      transformation: [
        { width: 1920, height: 1080, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    logger.info(`${results.length} hero images uploaded by admin: ${req.user?.email || 'unknown'}`);

    res.status(201).json({
      success: true,
      message: `${results.length} hero image(s) uploaded successfully`,
      data: results
    });
  } catch (error: any) {
    logger.error(`Hero upload error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to upload hero images', 500));
  }
});

// @desc    Upload about section image
// @route   POST /api/upload/about-image
// @access  Private
export const uploadAboutImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let base64Image: string;

  // FIXED: Check for imageBase64 field from multer (single file)
  if (req.body.imageBase64) {
    base64Image = req.body.imageBase64;
  } else if (req.body.image) {
    base64Image = req.body.image;
  } else {
    logger.error('About upload - No image found in request body', req.body);
    return next(new AppError('Please provide an about section image', 400));
  }

  // Validate base64 image
  if (!validateBase64Image(base64Image)) {
    return next(new AppError('Invalid image format. Please provide a valid image file', 400));
  }

  try {
    // Upload to about folder with optimizations
    const result = await uploadImageToCloudinary(base64Image, {
      folder: 'rass-engineering/about',
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    logger.info(`About image uploaded by admin: ${req.user?.email || 'unknown'}`);

    res.status(201).json({
      success: true,
      message: 'About image uploaded successfully',
      data: [result] // Return as array for consistency with uploadImages
    });
  } catch (error: any) {
    logger.error(`About upload error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to upload about image', 500));
  }
});