import { Request, Response, NextFunction } from 'express';
import Contact, { IContact } from '../models/contact.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
export const submitContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, email, serviceType, message } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !serviceType || !message) {
    return next(new AppError('Please provide all required fields', 400));
  }

  try {
    const contact = await Contact.create({
      name,
      phone,
      email,
      serviceType: serviceType.toLowerCase(),
      message,
      status: 'new'
    });

    logger.info(`New contact submission from: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email
      }
    });
  } catch (error: any) {
    logger.error(`Contact submission error: ${error.message}`);
    return next(new AppError(error.message || 'Failed to submit contact form', 500));
  }
});

// @desc    Get all contacts (Admin)
// @route   GET /api/contacts
// @access  Private
export const getAllContacts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status, page = 1, limit = 50 } = req.query;

  const query: any = {};
  if (status && typeof status === 'string') {
    query.status = status.toLowerCase();
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: contacts
    });
  } catch (error: any) {
    logger.error(`Fetch contacts error: ${error.message}`);
    return next(new AppError('Failed to fetch contacts', 500));
  }
});

// @desc    Get single contact (Admin)
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error: any) {
    logger.error(`Fetch contact error: ${error.message}`);
    return next(new AppError('Failed to fetch contact', 500));
  }
});

// @desc    Update contact status (Admin)
// @route   PATCH /api/contacts/:id/status
// @access  Private
export const updateContactStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['new', 'read', 'replied'].includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    logger.info(`Contact ${id} status updated to ${status} by admin: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error: any) {
    logger.error(`Update contact status error: ${error.message}`);
    return next(new AppError('Failed to update contact status', 500));
  }
});

// @desc    Delete contact (Admin)
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    logger.info(`Contact ${id} deleted by admin: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Delete contact error: ${error.message}`);
    return next(new AppError('Failed to delete contact', 500));
  }
});

// @desc    Get contact statistics (Admin)
// @route   GET /api/contacts/stats
// @access  Private
export const getContactStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Contact.countDocuments();

    const formattedStats = {
      total,
      new: stats.find(s => s._id === 'new')?.count || 0,
      read: stats.find(s => s._id === 'read')?.count || 0,
      replied: stats.find(s => s._id === 'replied')?.count || 0
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error: any) {
    logger.error(`Contact stats error: ${error.message}`);
    return next(new AppError('Failed to fetch contact statistics', 500));
  }
});