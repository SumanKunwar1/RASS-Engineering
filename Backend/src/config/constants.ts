import dotenv from 'dotenv';

dotenv.config();

// Server Configuration
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';

// Database
export const MONGODB_URI = process.env.MONGODB_URI || '';

// JWT Authentication
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
export const ADMIN_JWT_EXPIRY = process.env.ADMIN_JWT_EXPIRY || '1d';

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';

// Email Configuration
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || '';
export const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || '';

// Admin Configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
export const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || '';
export const ADMIN_NAME = process.env.ADMIN_NAME || '';

// Security & Rate Limiting
export const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '900000';
export const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '100';

// Application
export const APP_NAME = process.env.APP_NAME || 'RASS Engineering';
export const COMPANY_NAME = process.env.COMPANY_NAME || '';
export const COMPANY_PHONE = process.env.COMPANY_PHONE || '';
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL || '';
export const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || '';

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;