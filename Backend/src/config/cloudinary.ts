import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Verify configuration
const verifyCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    logger.warn('⚠️  Cloudinary credentials not found in environment variables');
    return false;
  }
  logger.info('✅ Cloudinary configured successfully');
  return true;
};

verifyCloudinaryConfig();

export default cloudinary;