import { Request, Response, NextFunction } from 'express';
import TrustedBy, { ITrustedBy } from '../models/trustedBy.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Get all active trusted companies (Public)
// @route   GET /api/trusted-by
// @access  Public
export const getAllTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trustedCompanies = await TrustedBy.find({ active: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trustedCompanies.length,
      data: trustedCompanies
    });
  } catch (error: any) {
    logger.error(`Get trusted companies error: ${error.message}`);
    return next(new AppError('Failed to fetch trusted companies', 500));
  }
});

// @desc    Get all trusted companies including inactive (Admin)
// @route   GET /api/trusted-by/admin/all
// @access  Private
export const getAdminTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trustedCompanies = await TrustedBy.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trustedCompanies.length,
      data: trustedCompanies
    });
  } catch (error: any) {
    logger.error(`Get admin trusted companies error: ${error.message}`);
    return next(new AppError('Failed to fetch trusted companies', 500));
  }
});

// @desc    Get single trusted company (Admin)
// @route   GET /api/trusted-by/:id
// @access  Private
export const getTrustedById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const company = await TrustedBy.findById(id);

    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error: any) {
    logger.error(`Get trusted company error: ${error.message}`);
    return next(new AppError('Failed to fetch company', 500));
  }
});

// @desc    Create new trusted company (Admin)
// @route   POST /api/trusted-by
// @access  Private
export const createTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, logo, order, active } = req.body;

  if (!name || !logo) {
    return next(new AppError('Name and logo are required', 400));
  }

  try {
    const company = await TrustedBy.create({
      name,
      logo,
      order: order || 0,
      active: active !== undefined ? active : true
    });

    logger.info(`Trusted company created by admin: ${req.user?.email || 'unknown'}`);

    res.status(201).json({
      success: true,
      message: 'Company added successfully',
      data: company
    });
  } catch (error: any) {
    logger.error(`Create trusted company error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to create company', 500));
  }
});

// @desc    Update trusted company (Admin)
// @route   PUT /api/trusted-by/:id
// @access  Private
export const updateTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, logo, order, active } = req.body;

  try {
    const company = await TrustedBy.findByIdAndUpdate(
      id,
      { name, logo, order, active },
      { new: true, runValidators: true }
    );

    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    logger.info(`Trusted company ${id} updated by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error: any) {
    logger.error(`Update trusted company error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to update company', 500));
  }
});

// @desc    Delete trusted company (Admin)
// @route   DELETE /api/trusted-by/:id
// @access  Private
export const deleteTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const company = await TrustedBy.findByIdAndDelete(id);

    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    logger.info(`Trusted company ${id} deleted by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete trusted company error: ${error.message}`);
    return next(new AppError('Failed to delete company', 500));
  }
});

// @desc    Toggle trusted company active status (Admin)
// @route   PATCH /api/trusted-by/:id/toggle-active
// @access  Private
export const toggleTrustedActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const company = await TrustedBy.findById(id);

    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    company.active = !company.active;
    await company.save();

    logger.info(`Trusted company ${id} active status toggled by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: `Company ${company.active ? 'activated' : 'deactivated'} successfully`,
      data: company
    });
  } catch (error: any) {
    logger.error(`Toggle trusted company active error: ${error.message}`);
    return next(new AppError('Failed to toggle company status', 500));
  }
});

// @desc    Reorder trusted companies (Admin)
// @route   PATCH /api/trusted-by/reorder
// @access  Private
export const reorderTrustedBy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { companies } = req.body;

  if (!companies || !Array.isArray(companies)) {
    return next(new AppError('Invalid companies data', 400));
  }

  try {
    const updatePromises = companies.map((company: { id: string; order: number }) =>
      TrustedBy.findByIdAndUpdate(company.id, { order: company.order })
    );

    await Promise.all(updatePromises);

    logger.info(`Trusted companies reordered by admin: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      success: true,
      message: 'Companies reordered successfully'
    });
  } catch (error: any) {
    logger.error(`Reorder trusted companies error: ${error.message}`);
    return next(new AppError('Failed to reorder companies', 500));
  }
});