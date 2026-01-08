import { Request, Response, NextFunction } from 'express';
import Testimonial, { ITestimonial } from '../models/testimonial.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Get all active testimonials (Public)
// @route   GET /api/testimonials
// @access  Public
export const getAllTestimonials = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error: any) {
    logger.error(`Get testimonials error: ${error.message}`);
    return next(new AppError('Failed to fetch testimonials', 500));
  }
});

// @desc    Get all testimonials including inactive (Admin)
// @route   GET /api/testimonials/admin/all
// @access  Private
export const getAdminTestimonials = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error: any) {
    logger.error(`Get admin testimonials error: ${error.message}`);
    return next(new AppError('Failed to fetch testimonials', 500));
  }
});

// @desc    Get single testimonial (Admin)
// @route   GET /api/testimonials/:id
// @access  Private
export const getTestimonialById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error: any) {
    logger.error(`Get testimonial error: ${error.message}`);
    return next(new AppError('Failed to fetch testimonial', 500));
  }
});

// @desc    Create new testimonial (Admin)
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, position, company, testimonial, image, rating, order, active } = req.body;

  if (!name || !position || !company || !testimonial) {
    return next(new AppError('Name, position, company and testimonial are required', 400));
  }

  try {
    const newTestimonial = await Testimonial.create({
      name,
      position,
      company,
      testimonial,
      image: image || '',
      rating: rating || 5,
      order: order || 0,
      active: active !== undefined ? active : true
    });

    logger.info(`Testimonial created by admin: ${req.user?.email || 'unknown'}`);

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: newTestimonial
    });
  } catch (error: any) {
    logger.error(`Create testimonial error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to create testimonial', 500));
  }
});

// @desc    Update testimonial (Admin)
// @route   PUT /api/testimonials/:id
// @access  Private
export const updateTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, position, company, testimonial, image, rating, order, active } = req.body;

  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, position, company, testimonial, image, rating, order, active },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    logger.info(`Testimonial ${id} updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    });
  } catch (error: any) {
    logger.error(`Update testimonial error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to update testimonial', 500));
  }
});

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/testimonials/:id
// @access  Private
export const deleteTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    logger.info(`Testimonial ${id} deleted by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete testimonial error: ${error.message}`);
    return next(new AppError('Failed to delete testimonial', 500));
  }
});

// @desc    Toggle testimonial active status (Admin)
// @route   PATCH /api/testimonials/:id/toggle-active
// @access  Private
export const toggleTestimonialActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    testimonial.active = !testimonial.active;
    await testimonial.save();

    logger.info(`Testimonial ${id} active status toggled by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.active ? 'activated' : 'deactivated'} successfully`,
      data: testimonial
    });
  } catch (error: any) {
    logger.error(`Toggle testimonial active error: ${error.message}`);
    return next(new AppError('Failed to toggle testimonial status', 500));
  }
});