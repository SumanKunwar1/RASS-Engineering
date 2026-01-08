import express, { Router } from 'express';
import {
  getAllTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive
} from '../controllers/testimonial.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getAllTestimonials);

// Admin routes (protected)
router.use(protect);

router.get('/admin/all', getAdminTestimonials);
router.post('/', createTestimonial);
router.get('/:id', getTestimonialById);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/toggle-active', toggleTestimonialActive);

export default router;