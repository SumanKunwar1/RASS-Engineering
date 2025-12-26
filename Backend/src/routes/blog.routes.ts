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

// Admin routes first (most specific)
router.get('/admin/all', protect, getAdminBlogs);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.patch('/:id/toggle-published', protect, toggleBlogPublished);

// Public routes (less specific)
router.get('/category/:category', getBlogsByCategory);
router.get('/:id/related', getRelatedBlogs);
router.get('/:identifier', getBlogById);
router.get('/', getAllBlogs);

export default router;