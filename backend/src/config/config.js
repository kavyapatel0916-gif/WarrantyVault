'use strict';
require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/warrantyvault',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production_32chars_min',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

if (config.jwtSecret.length < 32) {
  console.warn('[WARN] JWT_SECRET is too short. Use at least 32 random characters in production.');
}

module.exports = config;
