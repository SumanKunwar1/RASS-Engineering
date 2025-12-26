import { Request, Response, NextFunction } from 'express';
import Blog from '../models/blog.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { 
  uploadImageToCloudinary, 
  deleteImageFromCloudinary 
} from '../utils/cloudinary.utils';
import logger from '../utils/logger';
import { validateBase64Image } from '../middleware/upload.middleware';

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
};

// @desc    Get all published blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const filter: any = { published: true, isActive: true };
  if (category && category !== 'All') {
    filter.category = category;
  }

  const blogs = await Blog.find(filter).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get single blog by ID or slug (public)
// @route   GET /api/blogs/:identifier
// @access  Public
export const getBlogById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params;
  
  // Try to find by ID first, then by slug
  let blog = await Blog.findById(identifier);
  
  if (!blog) {
    blog = await Blog.findOne({ slug: identifier });
  }

  if (!blog || !blog.published || !blog.isActive) {
    return next(new AppError('Blog post not found', 404));
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Create new blog post
// @route   POST /api/admin/blogs
// @access  Private (Admin)
export const createBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    excerpt,
    content,
    author,
    date,
    category,
    image,
    readTime,
    published,
    tags
  } = req.body;

  // Validate required fields
  if (!title || !excerpt || !content || !category || !image) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Validate image
  if (!validateBase64Image(image)) {
    return next(new AppError('Invalid image format', 400));
  }

  try {
    // Upload image to Cloudinary
    const imageResult = await uploadImageToCloudinary(image, {
      folder: 'rass-engineering/blog',
      transformation: [
        { width: 1200, height: 630, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Calculate read time if not provided
    const finalReadTime = readTime || calculateReadTime(content);

    // Create blog
    const blog = await Blog.create({
      title,
      excerpt,
      content,
      author: author || 'RASS Engineering Team',
      date: date || new Date(),
      category,
      image: imageResult.url,
      imagePublicId: imageResult.publicId,
      readTime: finalReadTime,
      published: published || false,
      tags: tags || []
    });

    logger.info(`Blog created by admin: ${req.user?.email} - ${blog.title}`);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error: any) {
    logger.error('Blog creation error:', error);
    return next(new AppError(error.message || 'Failed to create blog post', 500));
  }
});

// @desc    Update blog post
// @route   PUT /api/admin/blogs/:id
// @access  Private (Admin)
export const updateBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  const {
    title,
    excerpt,
    content,
    author,
    date,
    category,
    image,
    readTime,
    published,
    tags
  } = req.body;

  try {
    let updateData: any = {
      title: title || blog.title,
      excerpt: excerpt || blog.excerpt,
      content: content || blog.content,
      author: author || blog.author,
      date: date || blog.date,
      category: category || blog.category,
      readTime: readTime || blog.readTime,
      published: published !== undefined ? published : blog.published,
      tags: tags || blog.tags
    };

    // Recalculate read time if content changed
    if (content && content !== blog.content) {
      updateData.readTime = calculateReadTime(content);
    }

    // Update image if new one provided
    if (image && image !== blog.image) {
      if (!validateBase64Image(image)) {
        return next(new AppError('Invalid image format', 400));
      }

      // Delete old image
      await deleteImageFromCloudinary(blog.imagePublicId);

      // Upload new image
      const imageResult = await uploadImageToCloudinary(image, {
        folder: 'rass-engineering/blog',
        transformation: [
          { width: 1200, height: 630, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });

      updateData.image = imageResult.url;
      updateData.imagePublicId = imageResult.publicId;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Blog updated by admin: ${req.user?.email} - ${updatedBlog?.title}`);

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedBlog
    });
  } catch (error: any) {
    logger.error('Blog update error:', error);
    return next(new AppError(error.message || 'Failed to update blog post', 500));
  }
});

// @desc    Delete blog post
// @route   DELETE /api/admin/blogs/:id
// @access  Private (Admin)
export const deleteBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  try {
    // Delete image from Cloudinary
    await deleteImageFromCloudinary(blog.imagePublicId);

    // Delete blog from database
    await Blog.findByIdAndDelete(req.params.id);

    logger.info(`Blog deleted by admin: ${req.user?.email} - ${blog.title}`);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    logger.error('Blog deletion error:', error);
    return next(new AppError(error.message || 'Failed to delete blog post', 500));
  }
});

// @desc    Get all blogs for admin (includes unpublished)
// @route   GET /api/admin/blogs
// @access  Private (Admin)
export const getAdminBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Toggle blog published status
// @route   PATCH /api/admin/blogs/:id/toggle-published
// @access  Private (Admin)
export const toggleBlogPublished = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  blog.published = !blog.published;
  await blog.save();

  logger.info(`Blog status toggled by admin: ${req.user?.email} - ${blog.title} - ${blog.published ? 'Published' : 'Unpublished'}`);

  res.status(200).json({
    success: true,
    message: `Blog post ${blog.published ? 'published' : 'unpublished'} successfully`,
    data: blog
  });
});

// @desc    Get blogs by category (public)
// @route   GET /api/blogs/category/:category
// @access  Public
export const getBlogsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const blogs = await Blog.find({
    category,
    published: true,
    isActive: true
  }).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get related blogs (same category, excluding current)
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  const relatedBlogs = await Blog.find({
    category: blog.category,
    _id: { $ne: blog._id },
    published: true,
    isActive: true
  })
    .sort({ date: -1 })
    .limit(3);

  res.status(200).json({
    success: true,
    count: relatedBlogs.length,
    data: relatedBlogs
  });
});