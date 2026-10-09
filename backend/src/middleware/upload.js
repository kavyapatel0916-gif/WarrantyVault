'use strict';
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const config = require('../config/config');

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

/**
 * Multer disk storage with UUID-based filenames to prevent path traversal
 * and avoid collisions.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

/**
 * Multer file filter: reject disallowed MIME types.
 */
function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `File type not allowed: ${file.mimetype}. Accepted: JPEG, PNG, WEBP, PDF.`));
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `File extension not allowed: ${ext}`));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 1,
  },
});

/**
 * Express error handler for Multer errors.
 */
function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: { code: 'FILE_TOO_LARGE', message: `File exceeds maximum size of ${config.maxFileSize / 1024 / 1024} MB.` },
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: { code: 'INVALID_FILE_TYPE', message: err.field || 'Invalid file type or extension.' },
      });
    }
    return res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: err.message } });
  }
  next(err);
}

module.exports = { upload, handleUploadError, ALLOWED_MIME_TYPES };
