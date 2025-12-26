import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAdminServices,
  toggleServiceActive,
  reorderServices
} from '../controllers/service.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Admin routes first (most specific)
router.get('/admin/all', protect, getAdminServices);
router.post('/', protect, createService);
router.patch('/reorder', protect, reorderServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);
router.patch('/:id/toggle-active', protect, toggleServiceActive);

// Public routes (less specific)
router.get('/:identifier', getServiceById);
router.get('/', getAllServices);

export default router;