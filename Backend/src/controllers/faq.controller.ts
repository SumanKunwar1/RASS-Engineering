import { Request, Response, NextFunction } from 'express';
import FAQ, { IFAQ } from '../models/faq.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Get all active FAQs (Public)
// @route   GET /api/faqs
// @access  Public
export const getAllFAQs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.query;

  const query: any = { active: true };
  if (category && typeof category === 'string') {
    query.category = category.toLowerCase();
  }

  try {
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error: any) {
    logger.error(`Get FAQs error: ${error.message}`);
    return next(new AppError('Failed to fetch FAQs', 500));
  }
});

// @desc    Get FAQs by category (Public)
// @route   GET /api/faqs/category/:category
// @access  Public
export const getFAQsByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.params;

  try {
    const faqs = await FAQ.find({ 
      category: category.toLowerCase(), 
      active: true 
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error: any) {
    logger.error(`Get FAQs by category error: ${error.message}`);
    return next(new AppError('Failed to fetch FAQs', 500));
  }
});

// @desc    Get all FAQs including inactive (Admin)
// @route   GET /api/faqs/admin/all
// @access  Private
export const getAdminFAQs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error: any) {
    logger.error(`Get admin FAQs error: ${error.message}`);
    return next(new AppError('Failed to fetch FAQs', 500));
  }
});

// @desc    Get single FAQ (Public)
// @route   GET /api/faqs/:id
// @access  Public
export const getFAQById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error: any) {
    logger.error(`Get FAQ error: ${error.message}`);
    return next(new AppError('Failed to fetch FAQ', 500));
  }
});

// @desc    Create new FAQ (Admin)
// @route   POST /api/faqs
// @access  Private
export const createFAQ = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { question, answer, category, order, active } = req.body;

  if (!question || !answer) {
    return next(new AppError('Question and answer are required', 400));
  }

  try {
    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'general',
      order: order || 0,
      active: active !== undefined ? active : true
    });

    logger.info(`FAQ created by admin: ${req.user?.email || 'unknown'}`);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error: any) {
    logger.error(`Create FAQ error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to create FAQ', 500));
  }
});

// @desc    Update FAQ (Admin)
// @route   PUT /api/faqs/:id
// @access  Private
export const updateFAQ = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { question, answer, category, order, active } = req.body;

  try {
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { question, answer, category, order, active },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }

    logger.info(`FAQ ${id} updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error: any) {
    logger.error(`Update FAQ error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to update FAQ', 500));
  }
});

// @desc    Delete FAQ (Admin)
// @route   DELETE /api/faqs/:id
// @access  Private
export const deleteFAQ = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }

    logger.info(`FAQ ${id} deleted by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete FAQ error: ${error.message}`);
    return next(new AppError('Failed to delete FAQ', 500));
  }
});

// @desc    Toggle FAQ active status (Admin)
// @route   PATCH /api/faqs/:id/toggle-active
// @access  Private
export const toggleFAQActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      return next(new AppError('FAQ not found', 404));
    }

    faq.active = !faq.active;
    await faq.save();

    logger.info(`FAQ ${id} active status toggled by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: `FAQ ${faq.active ? 'activated' : 'deactivated'} successfully`,
      data: faq
    });
  } catch (error: any) {
    logger.error(`Toggle FAQ active error: ${error.message}`);
    return next(new AppError('Failed to toggle FAQ status', 500));
  }
});

// @desc    Reorder FAQs (Admin)
// @route   PATCH /api/faqs/reorder
// @access  Private
export const reorderFAQs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { faqs } = req.body;

  if (!faqs || !Array.isArray(faqs)) {
    return next(new AppError('Invalid FAQs data', 400));
  }

  try {
    const updatePromises = faqs.map((faq: { id: string; order: number }) =>
      FAQ.findByIdAndUpdate(faq.id, { order: faq.order })
    );

    await Promise.all(updatePromises);

    logger.info(`FAQs reordered by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'FAQs reordered successfully'
    });
  } catch (error: any) {
    logger.error(`Reorder FAQs error: ${error.message}`);
    return next(new AppError('Failed to reorder FAQs', 500));
  }
});