import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from './errorHandler';

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed mime types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed`, 400));
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

/**
 * Middleware for single image upload
 */
export const uploadSingleImage = upload.single('image');

/**
 * Middleware for multiple images upload
 * @param maxCount - Maximum number of files (default: 10)
 */
export const uploadMultipleImages = (maxCount: number = 10) => {
  return upload.array('images', maxCount);
};

/**
 * Middleware for multiple fields with images
 */
export const uploadFields = upload.fields([
  { name: 'heroImages', maxCount: 10 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'serviceImage', maxCount: 1 },
  { name: 'projectImages', maxCount: 20 },
  { name: 'blogImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]);

/**
 * Handle multer errors
 */
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Too many files uploaded', 400));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Unexpected field in upload', 400));
    }
    return next(new AppError(err.message, 400));
  }
  next(err);
};

/**
 * Validate base64 image string
 */
export const validateBase64Image = (base64String: string): boolean => {
  if (!base64String) return false;
  
  // Check if it's a valid base64 string with image data
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
  return base64Regex.test(base64String);
};

/**
 * Convert buffer to base64 string
 */
export const bufferToBase64 = (buffer: Buffer, mimetype: string): string => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

/**
 * Middleware to convert uploaded files to base64
 */
export const convertToBase64 = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Handle single file
    if (req.file) {
      req.body.imageBase64 = bufferToBase64(req.file.buffer, req.file.mimetype);
    }

    // Handle multiple files
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.body.imagesBase64 = req.files.map(file => 
          bufferToBase64(file.buffer, file.mimetype)
        );
      } else {
        // Handle fields
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        req.body.filesBase64 = {};
        
        for (const [fieldname, files] of Object.entries(filesObj)) {
          req.body.filesBase64[fieldname] = files.map(file => 
            bufferToBase64(file.buffer, file.mimetype)
          );
        }
      }
    }

    next();
  } catch (error) {
    next(new AppError('Failed to process uploaded files', 500));
  }
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  uploadFields,
  handleMulterError,
  validateBase64Image,
  bufferToBase64,
  convertToBase64
};