'use strict';

/**
 * Global error handler middleware.
 * Must be the last middleware registered in express.
 */
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: messages.join('; ') },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      error: { code: 'DUPLICATE_KEY', message: `${field} already exists.` },
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: { code: 'INVALID_ID', message: 'Invalid resource ID format.' },
    });
  }

  // Default 500
  const status = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'An internal error occurred.' : (err.message || 'Internal server error');
  res.status(status).json({ error: { code: 'INTERNAL_ERROR', message } });
}

/**
 * 404 handler - must be before errorHandler but after all routes.
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` } });
}

module.exports = { errorHandler, notFoundHandler };
