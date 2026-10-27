'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const receiptRoutes = require('./routes/receipts');
const serviceRoutes = require('./routes/services');
const dashboardRoutes = require('./routes/dashboard');

function createApp() {
  const app = express();

  // Ensure uploads directory exists
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }

  // Security headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Configured by Nginx in production
  }));

  // CORS - allow configured origin with credentials for cookies
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Parse JSON and cookies
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Health check (no auth required)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/receipts', receiptRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // NOTE: Uploaded files are NOT served as static assets.
  // They are accessed only via /api/receipts/:id/download (authenticated + ownership check).

  // Serve the frontend static files (plain HTML/CSS/JS, no build needed)
  const frontendPath = path.join(__dirname, '..', '..', 'frontend');
  app.use(express.static(frontendPath));

  // For any non-API route, serve index.html (SPA hash routing)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

  // 404 and error handling (for API routes only)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
