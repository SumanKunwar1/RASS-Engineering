import express, { Router } from 'express';
import {
  submitQuote,
  getAllQuotes,
  getQuote,
  updateQuoteStatus,
  deleteQuote,
  getQuoteStats
} from '../controllers/quote.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.post('/', submitQuote);

// Protected routes (Admin only)
router.use(protect);

router.get('/stats', getQuoteStats);
router.get('/', getAllQuotes);
router.get('/:id', getQuote);
router.patch('/:id/status', updateQuoteStatus);
router.delete('/:id', deleteQuote);

export default router;