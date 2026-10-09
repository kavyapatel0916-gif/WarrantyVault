'use strict';
const { z } = require('zod');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { CATEGORIES } = require('../models/Product');
const { computeWarranty } = require('../services/warrantyService');
const { cleanupProduct } = require('../services/cleanupService');

const productSchema = z.object({
  name: z.string().min(2).max(120),
  brand: z.string().min(1).max(80),
  model: z.string().max(80).optional(),
  category: z.enum(CATEGORIES),
  serialNumber: z.string().max(100).optional(),
  seller: z.string().max(120).optional(),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'purchaseDate must be YYYY-MM-DD'),
  warrantyMonths: z.number().int().min(0).max(240),
  purchasePrice: z.number().min(0),
  currency: z.enum(['INR']).default('INR'),
  notes: z.string().max(1000).optional(),
});

const updateSchema = productSchema.partial();

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listProducts(req, res, next) {
  try {
    const { q, category, status, sort = 'expiry_asc', page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { ownerId: req.userId };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ];
    }
    if (category && CATEGORIES.includes(category)) {
      filter.category = category;
    }

    // Status filter: computed from expiry date
    const today = new Date().toISOString().slice(0, 10);
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    if (status === 'active') {
      filter.warrantyExpiryDate = { $gt: in30Days };
    } else if (status === 'expiring') {
      filter.warrantyExpiryDate = { $gte: today, $lte: in30Days };
    } else if (status === 'expired') {
      filter.warrantyExpiryDate = { $lt: today };
    }

    let sortObj = {};
    if (sort === 'expiry_asc') sortObj = { warrantyExpiryDate: 1 };
    else if (sort === 'expiry_desc') sortObj = { warrantyExpiryDate: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else sortObj = { warrantyExpiryDate: 1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    // Attach computed status + daysRemaining
    const enriched = products.map((p) => {
      const { daysRemaining, status: wStatus } = computeWarranty(p.purchaseDate, p.warrantyMonths);
      return { ...p.toObject(), daysRemaining, warrantyStatus: wStatus };
    });

    return res.json({
      data: {
        products: enriched,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
      });
    }

    const data = parsed.data;
    const { expiryDate } = computeWarranty(data.purchaseDate, data.warrantyMonths);

    const product = await Product.create({
      ...data,
      ownerId: req.userId,
      warrantyExpiryDate: expiryDate,
    });

    const { daysRemaining, status } = computeWarranty(product.purchaseDate, product.warrantyMonths);

    return res.status(201).json({
      data: { product: { ...product.toObject(), daysRemaining, warrantyStatus: status } },
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    const product = await Product.findOne({ _id: id, ownerId: req.userId });
    if (!product) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    const { daysRemaining, status, reminderDays } = computeWarranty(product.purchaseDate, product.warrantyMonths);

    return res.json({
      data: { product: { ...product.toObject(), daysRemaining, warrantyStatus: status, reminderDays } },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
      });
    }

    const existing = await Product.findOne({ _id: id, ownerId: req.userId });
    if (!existing) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    const updateData = parsed.data;

    // Recompute expiry if relevant fields changed
    const newPurchaseDate = updateData.purchaseDate || existing.purchaseDate;
    const newWarrantyMonths = updateData.warrantyMonths !== undefined ? updateData.warrantyMonths : existing.warrantyMonths;
    const { expiryDate } = computeWarranty(newPurchaseDate, newWarrantyMonths);
    updateData.warrantyExpiryDate = expiryDate;

    const product = await Product.findOneAndUpdate(
      { _id: id, ownerId: req.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const { daysRemaining, status } = computeWarranty(product.purchaseDate, product.warrantyMonths);

    return res.json({
      data: { product: { ...product.toObject(), daysRemaining, warrantyStatus: status } },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    const product = await Product.findOne({ _id: id, ownerId: req.userId });
    if (!product) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    // Cascade: delete receipts (files + DB) and service records
    await cleanupProduct(id);
    await Product.deleteOne({ _id: id });

    return res.json({ data: { message: 'Product and all related records deleted successfully.' } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, createProduct, getProduct, updateProduct, deleteProduct };
