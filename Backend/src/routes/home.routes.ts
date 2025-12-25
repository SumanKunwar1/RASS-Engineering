import express from 'express';
import {
  getHomepageContent,
  getHeroSection,
  getAboutSection,
  getServices,
  getContactCTA
} from '../controllers/home.controller';

const router = express.Router();

// Public routes - No authentication required
router.get('/', getHomepageContent);
router.get('/hero', getHeroSection);
router.get('/about', getAboutSection);
router.get('/services', getServices);
router.get('/contact-cta', getContactCTA);

export default router;