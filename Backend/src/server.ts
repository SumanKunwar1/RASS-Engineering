import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/database';
import './config/cloudinary'; // Initialize Cloudinary
import logger from './utils/logger';
import { seedAdmin } from './utils/seedAdmin';

const PORT = process.env.PORT || 6000;

// Connect to Database and seed admin
connectDB().then(() => {
  // Seed initial admin user
  seedAdmin();
});

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  logger.info(`📍 Server URL: ${process.env.SERVER_URL}`);
  logger.info(`🌐 Client URL: ${process.env.CLIENT_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});