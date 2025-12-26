import express, { Router, Request, Response, NextFunction } from 'express';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  uploadFromUrl,
  getImagesFromFolder,
  uploadHeroImages,
  uploadAboutImage
} from '../controllers/cloudinary.controller';
import { protect } from '../middleware/auth.middleware';
import {
  uploadSingleImage,
  uploadMultipleImages,
  convertToBase64,
  handleMulterError
} from '../middleware/upload.middleware';

const router: Router = express.Router();

// All routes are protected
router.use(protect);

// ==================== SINGLE IMAGE UPLOAD ====================
router.post(
  '/image',
  uploadSingleImage,
  (err: any, req: Request, res: Response, next: NextFunction) => handleMulterError(err, req, res, next),
  convertToBase64,
  uploadImage
);

// ==================== MULTIPLE IMAGES UPLOAD ====================
router.post(
  '/images',
  uploadMultipleImages(),
  (err: any, req: Request, res: Response, next: NextFunction) => handleMulterError(err, req, res, next),
  convertToBase64,
  uploadImages
);

// ==================== HERO IMAGES UPLOAD ====================
router.post(
  '/hero-images',
  uploadMultipleImages(),
  (err: any, req: Request, res: Response, next: NextFunction) => handleMulterError(err, req, res, next),
  convertToBase64,
  uploadHeroImages
);

// ==================== ABOUT IMAGE UPLOAD ====================
router.post(
  '/about-image',
  uploadSingleImage,
  (err: any, req: Request, res: Response, next: NextFunction) => handleMulterError(err, req, res, next),
  convertToBase64,
  uploadAboutImage
);

// ==================== UPLOAD FROM URL ====================
router.post('/image-url', uploadFromUrl);

// ==================== DELETE IMAGE ====================
router.delete('/image', deleteImage);

// ==================== GET IMAGES FROM FOLDER ====================
router.get('/folder/:folderPath?', getImagesFromFolder);

export default router;