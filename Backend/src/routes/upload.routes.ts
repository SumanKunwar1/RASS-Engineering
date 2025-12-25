import express from 'express';
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

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload routes
router.post('/image', uploadSingleImage, handleMulterError, convertToBase64, uploadImage);
router.post('/images', uploadMultipleImages(), handleMulterError, convertToBase64, uploadImages);
router.post('/image-url', uploadFromUrl);

// Specific content uploads
router.post('/hero-images', uploadHeroImages);
router.post('/about-image', uploadAboutImage);

// Delete route
router.delete('/image', deleteImage);

// Get images from folder
router.get('/folder/:folderPath?', getImagesFromFolder);

export default router;