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
  const { image, folder } = req.body;

  // Check if image is provided as base64 or from file upload
  let base64Image: string;

  if (image) {
    // Base64 from request body
    if (!validateBase64Image(image)) {
      return next(new AppError('Invalid image format. Please provide a valid base64 image', 400));
    }
    base64Image = image;
  } else if (req.body.imageBase64) {
    // Base64 from file upload middleware
    base64Image = req.body.imageBase64;
  } else {
    return next(new AppError('No image provided', 400));
  }

  // Upload to Cloudinary
  const result = await uploadImageToCloudinary(base64Image, {
    folder: folder || 'rass-engineering/general'
  });

  logger.info(`Image uploaded by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: result
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { images, folder } = req.body;

  let base64Images: string[];

  if (images && Array.isArray(images)) {
    // Validate all images
    const invalidImages = images.filter(img => !validateBase64Image(img));
    if (invalidImages.length > 0) {
      return next(new AppError('Some images have invalid format', 400));
    }
    base64Images = images;
  } else if (req.body.imagesBase64) {
    base64Images = req.body.imagesBase64;
  } else {
    return next(new AppError('No images provided', 400));
  }

  if (base64Images.length === 0) {
    return next(new AppError('No images provided', 400));
  }

  // Upload all images to Cloudinary
  const results = await uploadMultipleImages(base64Images, {
    folder: folder || 'rass-engineering/general'
  });

  logger.info(`${results.length} images uploaded by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: `${results.length} images uploaded successfully`,
    data: results
  });
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

  // Delete from Cloudinary
  await deleteImageFromCloudinary(imagePublicId);

  logger.info(`Image deleted by admin: ${req.user.email} - ${imagePublicId}`);

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully'
  });
});

// @desc    Upload image from external URL
// @route   POST /api/upload/image-url
// @access  Private
export const uploadFromUrl = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, folder } = req.body;

  if (!imageUrl) {
    return next(new AppError('Please provide imageUrl', 400));
  }

  // Upload to Cloudinary from URL
  const result = await uploadImageFromUrl(imageUrl, {
    folder: folder || 'rass-engineering/general'
  });

  logger.info(`Image uploaded from URL by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully from URL',
    data: result
  });
});

// @desc    Get all images from a folder
// @route   GET /api/upload/folder/:folderPath
// @access  Private
export const getImagesFromFolder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { folderPath } = req.params;

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
});

// @desc    Upload hero section images
// @route   POST /api/upload/hero-images
// @access  Private
export const uploadHeroImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { images } = req.body;

  if (!images || !Array.isArray(images) || images.length === 0) {
    return next(new AppError('Please provide hero images', 400));
  }

  // Validate all images
  const invalidImages = images.filter(img => !validateBase64Image(img));
  if (invalidImages.length > 0) {
    return next(new AppError('Some images have invalid format', 400));
  }

  // Upload to hero-images folder
  const results = await uploadMultipleImages(images, {
    folder: 'rass-engineering/hero-images',
    transformation: [
      { width: 1920, height: 1080, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });

  logger.info(`${results.length} hero images uploaded by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: `${results.length} hero images uploaded successfully`,
    data: results
  });
});

// @desc    Upload about section image
// @route   POST /api/upload/about-image
// @access  Private
export const uploadAboutImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { image } = req.body;

  if (!image || !validateBase64Image(image)) {
    return next(new AppError('Please provide a valid about section image', 400));
  }

  // Upload to about folder
  const result = await uploadImageToCloudinary(image, {
    folder: 'rass-engineering/about',
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });

  logger.info(`About image uploaded by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'About image uploaded successfully',
    data: result
  });
});