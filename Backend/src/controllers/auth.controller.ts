import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import Admin from '../models/admin.model';
import logger from '../utils/logger';

// Generate JWT Token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const expiresIn = process.env.ADMIN_JWT_EXPIRY || '1d';
  
  return jwt.sign(
    { id }, 
    secret as Secret,
    { expiresIn } as SignOptions
  );
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if admin exists
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    logger.warn(`Failed login attempt for email: ${email}`);
    return next(new AppError('Invalid credentials', 401));
  }

  // Check password
  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    logger.warn(`Failed login attempt for email: ${email}`);
    return next(new AppError('Invalid credentials', 401));
  }

  // Generate token
  const token = generateToken(admin._id.toString());

  logger.info(`Admin logged in: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }
  });
});

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Admin logged out: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  const admin = await Admin.findById(req.user.id).select('+password');

  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  // Check current password
  const isPasswordCorrect = await admin.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  logger.info(`Password changed for admin: ${admin.email}`);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
})