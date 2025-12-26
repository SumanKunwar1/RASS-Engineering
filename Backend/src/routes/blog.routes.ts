import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
  toggleBlogPublished,
  getBlogsByCategory,
  getRelatedBlogs
} from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:identifier', getBlogById); // Can be ID or slug
router.get('/:id/related', getRelatedBlogs);

// Admin routes (protected)
router.use(protect);

router.post('/', createBlog);
router.get('/admin/all', getAdminBlogs);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/toggle-published', toggleBlogPublished);

export default router;