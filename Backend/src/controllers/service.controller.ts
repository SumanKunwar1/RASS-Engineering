import { Request, Response, NextFunction } from 'express';
import Service from '../models/service.model';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { 
  uploadImageToCloudinary, 
  deleteImageFromCloudinary 
} from '../utils/cloudinary.utils';
import logger from '../utils/logger';

// @desc    Get all active services (public)
// @route   GET /api/services
// @access  Public
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Get single service by ID or slug (public)
// @route   GET /api/services/:identifier
// @access  Public
export const getServiceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params;
  
  // Try to find by ID first, then by slug
  let service = await Service.findById(identifier);
  
  if (!service) {
    service = await Service.findOne({ slug: identifier });
  }

  if (!service || !service.isActive) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create new service
// @route   POST /api/admin/services
// @access  Private (Admin)
export const createService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log('📝 Creating service...');
  
  const {
    title,
    description,
    subServices,
    applications,
    gradient,
    image,
    order
  } = req.body;

  // Validate required fields
  if (!title || !description || !image) {
    return next(new AppError('Please provide all required fields (title, description, image)', 400));
  }

  // Validate image format
  if (!image.startsWith('data:image/')) {
    return next(new AppError('Invalid image format', 400));
  }

  try {
    console.log('📤 Uploading image to Cloudinary...');
    
    // Upload image to Cloudinary
    const imageResult = await uploadImageToCloudinary(image, {
      folder: 'rass-engineering/services',
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ Image uploaded:', imageResult.publicId);

    // Create service
    const service = await Service.create({
      title,
      description,
      subServices: subServices || [],
      applications: applications || [],
      gradient: gradient || 'from-blue-500 to-blue-700',
      image: imageResult.url,
      imagePublicId: imageResult.publicId,
      order: order || 0
    });

    console.log('✅ Service created:', service._id);

    logger.info(`Service created by admin: ${req.user?.email} - ${service.title}`);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error: any) {
    console.error('❌ Service creation error:', error);
    logger.error('Service creation error:', error);
    return next(new AppError(error.message || 'Failed to create service', 500));
  }
});

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private (Admin)
export const updateService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  const {
    title,
    description,
    subServices,
    applications,
    gradient,
    image,
    order
  } = req.body;

  try {
    let updateData: any = {
      title: title || service.title,
      description: description || service.description,
      subServices: subServices || service.subServices,
      applications: applications || service.applications,
      gradient: gradient || service.gradient,
      order: order !== undefined ? order : service.order
    };

    // Update image if new one provided
    if (image && image !== service.image && image.startsWith('data:image/')) {
      console.log('📤 Uploading new image...');
      
      // Delete old image
      await deleteImageFromCloudinary(service.imagePublicId);

      // Upload new image
      const imageResult = await uploadImageToCloudinary(image, {
        folder: 'rass-engineering/services',
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });

      updateData.image = imageResult.url;
      updateData.imagePublicId = imageResult.publicId;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Service updated by admin: ${req.user?.email} - ${updatedService?.title}`);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error: any) {
    logger.error('Service update error:', error);
    return next(new AppError(error.message || 'Failed to update service', 500));
  }
});

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin)
export const deleteService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  try {
    // Delete image from Cloudinary
    await deleteImageFromCloudinary(service.imagePublicId);

    // Delete service from database
    await Service.findByIdAndDelete(req.params.id);

    logger.info(`Service deleted by admin: ${req.user?.email} - ${service.title}`);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    logger.error('Service deletion error:', error);
    return next(new AppError(error.message || 'Failed to delete service', 500));
  }
});

// @desc    Get all services for admin (includes inactive)
// @route   GET /api/admin/services
// @access  Private (Admin)
export const getAdminServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find().sort({ order: 1, createdAt: 1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Toggle service active status
// @route   PATCH /api/admin/services/:id/toggle-active
// @access  Private (Admin)
export const toggleServiceActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  service.isActive = !service.isActive;
  await service.save();

  logger.info(`Service status toggled by admin: ${req.user?.email} - ${service.title} - ${service.isActive ? 'Active' : 'Inactive'}`);

  res.status(200).json({
    success: true,
    message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
    data: service
  });
});

// @desc    Update service order
// @route   PATCH /api/admin/services/reorder
// @access  Private (Admin)
export const reorderServices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { services } = req.body; // Array of { id, order }

  if (!services || !Array.isArray(services)) {
    return next(new AppError('Please provide services array', 400));
  }

  try {
    const updatePromises = services.map(({ id, order }) =>
      Service.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    logger.info(`Services reordered by admin: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Services reordered successfully'
    });
  } catch (error: any) {
    logger.error('Service reorder error:', error);
    return next(new AppError(error.message || 'Failed to reorder services', 500));
  }
});