import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

// Validate request using express-validator
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  
  next();
};

// Common validation rules
export const commonValidations = {
  email: {
    isEmail: {
      bail: true,
      errorMessage: 'Please provide a valid email address'
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    },
  },
  name: {
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Name must be between 2 and 50 characters'
    },
    trim: true,
  },
  phone: {
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: 'Phone number must be between 10 and 15 digits'
    },
    matches: {
      options: /^[0-9+\-\s()]+$/,
      errorMessage: 'Please provide a valid phone number'
    },
  },
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[<>{}[\]\\]/g, ''); // Remove dangerous characters
};

// Validate image file
export const validateImageFile = (file: Express.Multer.File): boolean => {
  if (!file) return false;
  
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedMimeTypes.includes(file.mimetype) && file.size <= maxSize;
};