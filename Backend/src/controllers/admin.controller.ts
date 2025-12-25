import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import Homepage from '../models/homepage.model';
import logger from '../utils/logger';

// @desc    Update hero section
// @route   PUT /api/admin/home/hero
// @access  Private
export const updateHeroSection = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, titleHighlight, subtitle, images, buttons } = req.body;

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  // Update hero section
  homepage.hero = {
    title: title || homepage.hero.title,
    titleHighlight: titleHighlight || homepage.hero.titleHighlight,
    subtitle: subtitle || homepage.hero.subtitle,
    images: images || homepage.hero.images,
    buttons: buttons || homepage.hero.buttons
  };

  await homepage.save();

  logger.info(`Hero section updated by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Hero section updated successfully',
    data: homepage.hero
  });
});

// @desc    Update about section
// @route   PUT /api/admin/home/about
// @access  Private
export const updateAboutSection = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { subtitle, title, description1, description2, image, managingDirector } = req.body;

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  // Update about section
  homepage.about = {
    subtitle: subtitle || homepage.about.subtitle,
    title: title || homepage.about.title,
    description1: description1 || homepage.about.description1,
    description2: description2 || homepage.about.description2,
    image: image || homepage.about.image,
    managingDirector: managingDirector || homepage.about.managingDirector
  };

  await homepage.save();

  logger.info(`About section updated by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'About section updated successfully',
    data: homepage.about
  });
});

// @desc    Update services
// @route   PUT /api/admin/home/services
// @access  Private
export const updateServices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { services } = req.body;

  if (!services || !Array.isArray(services)) {
    return next(new AppError('Please provide valid services array', 400));
  }

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  homepage.services = services;
  await homepage.save();

  logger.info(`Services updated by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Services updated successfully',
    data: homepage.services
  });
});

// @desc    Add service
// @route   POST /api/admin/home/services
// @access  Private
export const addService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, icon } = req.body;

  if (!title || !description || !icon) {
    return next(new AppError('Please provide title, description, and icon', 400));
  }

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  const newService = {
    id: Date.now().toString(),
    title,
    description,
    icon
  };

  homepage.services.push(newService);
  await homepage.save();

  logger.info(`Service added by admin: ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Service added successfully',
    data: newService
  });
});

// @desc    Delete service
// @route   DELETE /api/admin/home/services/:id
// @access  Private
export const deleteService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  homepage.services = homepage.services.filter(service => service.id !== id);
  await homepage.save();

  logger.info(`Service deleted by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
});

// @desc    Update contact CTA
// @route   PUT /api/admin/home/contact-cta
// @access  Private
export const updateContactCTA = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { heading, subheading, phone, email } = req.body;

  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  homepage.contactCTA = {
    heading: heading || homepage.contactCTA.heading,
    subheading: subheading || homepage.contactCTA.subheading,
    phone: phone || homepage.contactCTA.phone,
    email: email || homepage.contactCTA.email
  };

  await homepage.save();

  logger.info(`Contact CTA updated by admin: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Contact CTA updated successfully',
    data: homepage.contactCTA
  });
});

// @desc    Get all homepage content (for admin)
// @route   GET /api/admin/home
// @access  Private
export const getAdminHomepageContent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homepage
  });
});