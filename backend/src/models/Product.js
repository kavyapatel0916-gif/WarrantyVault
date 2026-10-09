'use strict';
const mongoose = require('mongoose');
const { computeWarranty } = require('../services/warrantyService');

const CATEGORIES = ['Electronics', 'Appliances', 'Computers', 'Accessories', 'Furniture', 'Automotive', 'Other'];

const productSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name must be at most 120 characters'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      minlength: [1, 'Brand must be at least 1 character'],
      maxlength: [80, 'Brand must be at most 80 characters'],
      trim: true,
    },
    model: { type: String, maxlength: 80, trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Invalid category' },
    },
    serialNumber: { type: String, maxlength: 100, trim: true },
    seller: { type: String, maxlength: 120, trim: true },
    purchaseDate: {
      type: String, // YYYY-MM-DD stored as string for timezone safety
      required: [true, 'Purchase date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Purchase date must be YYYY-MM-DD'],
    },
    warrantyMonths: {
      type: Number,
      required: [true, 'Warranty months is required'],
      min: [0, 'Warranty months must be >= 0'],
      max: [240, 'Warranty months must be <= 240'],
      validate: { validator: Number.isInteger, message: 'Warranty months must be an integer' },
    },
    warrantyExpiryDate: {
      type: String, // YYYY-MM-DD derived, stored
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Purchase price must be >= 0'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR'],
    },
    notes: { type: String, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// Compound index for owner + expiry date queries
productSchema.index({ ownerId: 1, warrantyExpiryDate: 1 });

// Pre-save: compute warrantyExpiryDate
productSchema.pre('save', function (next) {
  if (this.isModified('purchaseDate') || this.isModified('warrantyMonths')) {
    const { expiryDate } = computeWarranty(this.purchaseDate, this.warrantyMonths);
    this.warrantyExpiryDate = expiryDate;
  }
  next();
});

// Pre-findOneAndUpdate: recompute warrantyExpiryDate
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const data = update.$set || update;
  if (data.purchaseDate || data.warrantyMonths !== undefined) {
    // We need both values — they might be in the update or existing doc
    // The controller will pre-compute and set warrantyExpiryDate explicitly
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
