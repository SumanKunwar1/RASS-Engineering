import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Configure multer storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed mime types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
  }
};

// Multer configuration
const multerConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
};

// Single image upload
export const uploadSingleImage = multer(multerConfig).single('file');

// Multiple images upload
export const uploadMultipleImages = () => multer(multerConfig).array('files', 10);

// Convert uploaded files to base64
export const convertToBase64 = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.files && Array.isArray(req.files)) {
      // Multiple files
      const imagesBase64 = req.files.map((file: Express.Multer.File) => {
        return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      });
      req.body.imagesBase64 = imagesBase64;
    } else if (req.file) {
      // Single file
      const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      req.body.imageBase64 = imageBase64;
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error converting file to base64',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Handle multer errors
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Check file size error - multer uses 'LIMIT_FILE_SIZE'
    if ((err as any).code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Upload failed'
    });
  }
  next();
};

// Validate base64 image
export const validateBase64Image = (base64String: string): boolean => {
  try {
    // Check if it starts with data:image
    if (!base64String.startsWith('data:image')) {
      return false;
    }
    
    // Extract the base64 part
    const parts = base64String.split(',');
    if (parts.length !== 2) {
      return false;
    }
    
    // Check if the base64 part is valid
    const base64 = parts[1];
    if (base64.length === 0) {
      return false;
    }
    
    // Try to decode it
    Buffer.from(base64, 'base64');
    return true;
  } catch (error) {
    return false;
  }
};