import express, { Router } from 'express';
import {
  getAllFAQs,
  getFAQsByCategory,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAdminFAQs,
  toggleFAQActive,
  reorderFAQs
} from '../controllers/faq.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getAllFAQs);
router.get('/category/:category', getFAQsByCategory);
router.get('/:id', getFAQById);

// Admin routes (protected)
router.use(protect);

router.get('/admin/all', getAdminFAQs);
router.post('/', createFAQ);
router.patch('/reorder', reorderFAQs);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.patch('/:id/toggle-active', toggleFAQActive);

export default router;