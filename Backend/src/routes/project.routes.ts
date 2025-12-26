import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAdminProjects,
  toggleProjectActive
} from '../controllers/project.controller';
import { protect} from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Admin routes (protected)
router.use(protect);

router.post('/', createProject);
router.get('/admin/all', getAdminProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/:id/toggle-active', toggleProjectActive);

export default router;