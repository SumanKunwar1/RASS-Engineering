import Admin from '../models/admin.model';
import logger from './logger';

export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@rass.com' });

    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    // Create default admin
    await Admin.create({
      email: 'admin@rass.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });

    logger.info('✅ Default admin user created successfully');
    logger.info('📧 Email: admin@rass.com');
    logger.info('🔑 Password: admin123');
    logger.info('⚠️  Please change the password after first login!');
  } catch (error) {
    logger.error('Error seeding admin user:', error);
  }
};