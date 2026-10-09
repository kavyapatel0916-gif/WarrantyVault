'use strict';
const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema(
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
    serviceDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Service date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Service date must be YYYY-MM-DD'],
    },
    provider: {
      type: String,
      maxlength: 120,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [2, 'Description must be at least 2 characters'],
      maxlength: [1000, 'Description must be at most 1000 characters'],
      trim: true,
    },
    cost: {
      type: Number,
      min: [0, 'Cost must be >= 0'],
      default: null,
    },
    status: {
      type: String,
      enum: ['requested', 'completed'],
      default: 'completed',
    },
    notes: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
