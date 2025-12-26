import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { 
  uploadImageToCloudinary, 
  uploadMultipleImages, 
  deleteImageFromCloudinary 
} from '../utils/cloudinary.utils';
import { validateBase64Image } from '../middleware/upload.middleware';
import logger from '../utils/logger';

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const filter: any = { isActive: true };
  if (category && category !== 'All') {
    filter.category = category;
  }

  const projects = await Project.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project by ID (public)
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id);

  if (!project || !project.isActive) {
    return next(new AppError('Project not found', 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/admin/projects
// @access  Private (Admin)
export const createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    category,
    location,
    year,
    client,
    description,
    scope,
    challenges,
    solution,
    results,
    image,
    gallery
  } = req.body;

  // Validate required fields
  if (!title || !category || !location || !year || !client || !description || !image) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Validate main image
  if (!validateBase64Image(image)) {
    return next(new AppError('Invalid main image format', 400));
  }

  try {
    // Upload main image to Cloudinary
    const mainImageResult = await uploadImageToCloudinary(image, {
      folder: 'rass-engineering/projects',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Upload gallery images if provided
    let galleryResults: any[] = [];
    if (gallery && Array.isArray(gallery) && gallery.length > 0) {
      // Validate all gallery images
      const invalidGalleryImages = gallery.filter((img: string) => !validateBase64Image(img));
      if (invalidGalleryImages.length > 0) {
        return next(new AppError(`${invalidGalleryImages.length} gallery image(s) have invalid format`, 400));
      }

      galleryResults = await uploadMultipleImages(gallery, {
        folder: 'rass-engineering/projects/gallery',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });
    }

    // Create project
    const project = await Project.create({
      title,
      category,
      location,
      year,
      client,
      description,
      scope: scope || [],
      challenges: challenges || '',
      solution: solution || '',
      results: results || [],
      image: mainImageResult.url,
      imagePublicId: mainImageResult.publicId,
      gallery: galleryResults.map(img => ({
        url: img.url,
        publicId: img.publicId
      }))
    });

    logger.info(`Project created by admin: ${req.user?.email} - ${project.title}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error: any) {
    logger.error('Project creation error:', error);
    return next(new AppError(error.message || 'Failed to create project', 500));
  }
});

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private (Admin)
export const updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  const {
    title,
    category,
    location,
    year,
    client,
    description,
    scope,
    challenges,
    solution,
    results,
    image,
    gallery
  } = req.body;

  try {
    let updateData: any = {
      title: title || project.title,
      category: category || project.category,
      location: location || project.location,
      year: year || project.year,
      client: client || project.client,
      description: description || project.description,
      scope: scope || project.scope,
      challenges: challenges || project.challenges,
      solution: solution || project.solution,
      results: results || project.results
    };

    // Update main image if new one provided
    if (image && image !== project.image) {
      if (!validateBase64Image(image)) {
        return next(new AppError('Invalid main image format', 400));
      }

      // Delete old image
      await deleteImageFromCloudinary(project.imagePublicId);

      // Upload new image
      const mainImageResult = await uploadImageToCloudinary(image, {
        folder: 'rass-engineering/projects',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });

      updateData.image = mainImageResult.url;
      updateData.imagePublicId = mainImageResult.publicId;
    }

    // Update gallery if new images provided
    if (gallery && Array.isArray(gallery)) {
      // Delete old gallery images
      for (const img of project.gallery) {
        await deleteImageFromCloudinary(img.publicId);
      }

      // Upload new gallery images
      if (gallery.length > 0) {
        const invalidGalleryImages = gallery.filter((img: string) => !validateBase64Image(img));
        if (invalidGalleryImages.length > 0) {
          return next(new AppError(`${invalidGalleryImages.length} gallery image(s) have invalid format`, 400));
        }

        const galleryResults = await uploadMultipleImages(gallery, {
          folder: 'rass-engineering/projects/gallery',
          transformation: [
            { width: 1200, height: 800, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        });

        updateData.gallery = galleryResults.map(img => ({
          url: img.url,
          publicId: img.publicId
        }));
      } else {
        updateData.gallery = [];
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Project updated by admin: ${req.user?.email} - ${updatedProject?.title}`);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error: any) {
    logger.error('Project update error:', error);
    return next(new AppError(error.message || 'Failed to update project', 500));
  }
});

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin)
export const deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  try {
    // Delete main image from Cloudinary
    await deleteImageFromCloudinary(project.imagePublicId);

    // Delete gallery images from Cloudinary
    for (const img of project.gallery) {
      await deleteImageFromCloudinary(img.publicId);
    }

    // Delete project from database
    await Project.findByIdAndDelete(req.params.id);

    logger.info(`Project deleted by admin: ${req.user?.email} - ${project.title}`);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error: any) {
    logger.error('Project deletion error:', error);
    return next(new AppError(error.message || 'Failed to delete project', 500));
  }
});

// @desc    Get all projects for admin (includes inactive)
// @route   GET /api/admin/projects
// @access  Private (Admin)
export const getAdminProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Toggle project active status
// @route   PATCH /api/admin/projects/:id/toggle-active
// @access  Private (Admin)
export const toggleProjectActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  project.isActive = !project.isActive;
  await project.save();

  logger.info(`Project status toggled by admin: ${req.user?.email} - ${project.title} - ${project.isActive ? 'Active' : 'Inactive'}`);

  res.status(200).json({
    success: true,
    message: `Project ${project.isActive ? 'activated' : 'deactivated'} successfully`,
    data: project
  });
});