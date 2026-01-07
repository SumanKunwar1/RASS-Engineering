import express, { Router } from 'express';
import {
  getAllTrustedBy,
  getAdminTrustedBy,
  getTrustedById,
  createTrustedBy,
  updateTrustedBy,
  deleteTrustedBy,
  toggleTrustedActive,
  reorderTrustedBy
} from '../controllers/trustedBy.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getAllTrustedBy);

// Admin routes (protected)
router.use(protect);

router.get('/admin/all', getAdminTrustedBy);
router.post('/', createTrustedBy);
router.patch('/reorder', reorderTrustedBy);
router.get('/:id', getTrustedById);
router.put('/:id', updateTrustedBy);
router.delete('/:id', deleteTrustedBy);
router.patch('/:id/toggle-active', toggleTrustedActive);

export default router;