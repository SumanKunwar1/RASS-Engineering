import { Request, Response, NextFunction } from 'express';
import Quote, { IQuote } from '../models/quote.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Submit quote request
// @route   POST /api/quotes
// @access  Public
export const submitQuote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    company,
    phone,
    email,
    serviceType,
    projectType,
    projectSize,
    timeline,
    budget,
    description,
    address
  } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !serviceType || !description || !address) {
    return next(new AppError('Please provide all required fields', 400));
  }

  try {
    const quote = await Quote.create({
      name,
      company: company || '',
      phone,
      email,
      serviceType: serviceType.toLowerCase(),
      projectType: projectType ? projectType.toLowerCase() : '',
      projectSize: projectSize || '',
      timeline: timeline ? timeline.toLowerCase() : '',
      budget: budget || '',
      description,
      address,
      status: 'new'
    });

    logger.info(`New quote request from: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully! We will contact you within 24 hours.',
      data: {
        id: quote._id,
        name: quote.name,
        email: quote.email
      }
    });
  } catch (error: any) {
    logger.error(`Quote submission error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to submit quote request', 500));
  }
});

// @desc    Get all quotes (Admin)
// @route   GET /api/quotes
// @access  Private
export const getAllQuotes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status, serviceType, page = 1, limit = 50 } = req.query;

  const query: any = {};
  if (status && typeof status === 'string') {
    query.status = status.toLowerCase();
  }
  if (serviceType && typeof serviceType === 'string') {
    query.serviceType = serviceType.toLowerCase();
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: quotes
    });
  } catch (error: any) {
    logger.error(`Fetch quotes error: ${error.message}`);
    return next(new AppError('Failed to fetch quotes', 500));
  }
});

// @desc    Get single quote (Admin)
// @route   GET /api/quotes/:id
// @access  Private
export const getQuote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const quote = await Quote.findById(id);

    if (!quote) {
      return next(new AppError('Quote not found', 404));
    }

    res.status(200).json({
      success: true,
      data: quote
    });
  } catch (error: any) {
    logger.error(`Fetch quote error: ${error.message}`);
    return next(new AppError('Failed to fetch quote', 500));
  }
});

// @desc    Update quote status (Admin)
// @route   PATCH /api/quotes/:id/status
// @access  Private
export const updateQuoteStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['new', 'contacted', 'quoted', 'closed'].includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  try {
    const quote = await Quote.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return next(new AppError('Quote not found', 404));
    }

    logger.info(`Quote ${id} status updated to ${status} by admin: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Quote status updated successfully',
      data: quote
    });
  } catch (error: any) {
    logger.error(`Update quote status error: ${error.message}`);
    return next(new AppError('Failed to update quote status', 500));
  }
});

// @desc    Delete quote (Admin)
// @route   DELETE /api/quotes/:id
// @access  Private
export const deleteQuote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return next(new AppError('Quote not found', 404));
    }

    logger.info(`Quote ${id} deleted by admin: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete quote error: ${error.message}`);
    return next(new AppError('Failed to delete quote', 500));
  }
});

// @desc    Get quote statistics (Admin)
// @route   GET /api/quotes/stats
// @access  Private
export const getQuoteStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Quote.countDocuments();

    const formattedStats = {
      total,
      new: stats.find(s => s._id === 'new')?.count || 0,
      contacted: stats.find(s => s._id === 'contacted')?.count || 0,
      quoted: stats.find(s => s._id === 'quoted')?.count || 0,
      closed: stats.find(s => s._id === 'closed')?.count || 0
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error: any) {
    logger.error(`Quote stats error: ${error.message}`);
    return next(new AppError('Failed to fetch quote statistics', 500));
  }
});