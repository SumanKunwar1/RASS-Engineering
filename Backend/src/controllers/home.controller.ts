import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import Homepage from '../models/homepage.model';
import logger from '../utils/logger';

// @desc    Get homepage content
// @route   GET /api/home
// @access  Public
export const getHomepageContent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let homepage = await Homepage.findOne();

  // If no homepage content exists, create default
  if (!homepage) {
    homepage = await Homepage.create({
      hero: {
        title: '32+ Years of',
        titleHighlight: 'Engineering Excellence',
        subtitle: 'Specialized Construction Solutions & Engineering Services',
        images: [
          'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.49_itbaq8.jpg',
          'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_ihyboi.jpg',
          'https://res.cloudinary.com/dihev9qxc/image/upload/v1766306898/WhatsApp_Image_2025-12-21_at_14.10.50_1_ifq2a2.jpg'
        ],
        buttons: [
          { id: '1', label: 'View Services', route: '/services', variant: 'primary' },
          { id: '2', label: 'Request Consultation', route: '/request-quote', variant: 'outline' }
        ]
      },
      about: {
        subtitle: 'ABOUT US',
        title: 'Building Trust Since 2050 B.S.',
        description1: 'Under the visionary leadership of Ram Kumar Shrestha, RASS Engineering has been at the forefront of specialized construction solutions for over three decades.',
        description2: 'We combine advanced technologies with time-tested engineering principles to deliver exceptional results that stand the test of time.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        managingDirector: 'Ram Kumar Shrestha'
      },
      services: [
        {
          id: '1',
          title: 'Deep Foundation',
          description: 'Specialized in pile foundation and deep excavation works',
          icon: 'Hammer'
        },
        {
          id: '2',
          title: 'Structural Works',
          description: 'Complete structural engineering solutions',
          icon: 'Building2'
        },
        {
          id: '3',
          title: 'Earth Retention',
          description: 'Advanced shoring and retaining systems',
          icon: 'Mountain'
        }
      ],
      contactCTA: {
        heading: 'Ready to Start Your Project?',
        subheading: 'Get a free site inspection and consultation from our expert engineers',
        phone: '+977-01-4782881',
        email: 'info@rassengineering.com'
      }
    });

    logger.info('Default homepage content created');
  }

  res.status(200).json({
    success: true,
    data: homepage
  });
});

// @desc    Get hero section
// @route   GET /api/home/hero
// @access  Public
export const getHeroSection = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homepage.hero
  });
});

// @desc    Get about section
// @route   GET /api/home/about
// @access  Public
export const getAboutSection = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homepage.about
  });
});

// @desc    Get services
// @route   GET /api/home/services
// @access  Public
export const getServices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homepage.services
  });
});

// @desc    Get contact CTA
// @route   GET /api/home/contact-cta
// @access  Public
export const getContactCTA = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const homepage = await Homepage.findOne();

  if (!homepage) {
    return next(new AppError('Homepage content not found', 404));
  }

  res.status(200).json({
    success: true,
    data: homepage.contactCTA
  });
});