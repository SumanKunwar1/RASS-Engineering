import express from 'express';
import {
  getAdminHomepageContent,
  updateHeroSection,
  updateAboutSection,
  updateServices,
  addService,
  deleteService,
  updateContactCTA
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// Homepage management routes
router.get('/home', getAdminHomepageContent);
router.put('/home/hero', updateHeroSection);
router.put('/home/about', updateAboutSection);
router.put('/home/services', updateServices);
router.post('/home/services', addService);
router.delete('/home/services/:id', deleteService);
router.put('/home/contact-cta', updateContactCTA);

export default router;