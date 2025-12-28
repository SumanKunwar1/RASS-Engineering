import express, { Router } from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contact.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.post('/', submitContact);

// Protected routes (Admin only)
router.use(protect);

router.get('/stats', getContactStats);
router.get('/', getAllContacts);
router.get('/:id', getContact);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;