import express, { Router } from 'express';
import {
  getAbout,
  updateAbout,
  updateMainContent,
  updateStory,
  addTeamMember,
  deleteTeamMember,
  addValue,
  deleteValue,
  addStat,
  deleteStat,
  updateLeadership
} from '../controllers/about.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes
router.get('/', getAbout);

// Protected routes (Admin only)
router.use(protect);

router.put('/', updateAbout);
router.patch('/main', updateMainContent);
router.patch('/story', updateStory);
router.patch('/leadership', updateLeadership);

// Team routes
router.post('/team', addTeamMember);
router.delete('/team/:id', deleteTeamMember);

// Values routes
router.post('/values', addValue);
router.delete('/values/:id', deleteValue);

// Stats routes
router.post('/stats', addStat);
router.delete('/stats/:index', deleteStat);

export default router;