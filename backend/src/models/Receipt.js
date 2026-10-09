'use strict';
const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    safeStoredName: {
      type: String,
      required: true, // UUID-based filename on disk
    },
    mimeType: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
      min: 0,
    },
    storagePath: {
      type: String,
      required: true,
      select: false, // Internal - never expose raw server path to client
    },
    ocrStatus: {
      type: String,
      enum: ['not_requested', 'pending', 'complete', 'failed'],
      default: 'not_requested',
    },
    ocrRawText: {
      type: String,
      default: null,
    },
    ocrCandidates: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receipt', receiptSchema);
