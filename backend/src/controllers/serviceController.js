'use strict';
const { z } = require('zod');
const mongoose = require('mongoose');
const ServiceRecord = require('../models/ServiceRecord');
const Product = require('../models/Product');

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const serviceSchema = z.object({
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'serviceDate must be YYYY-MM-DD'),
  provider: z.string().max(120).optional(),
  description: z.string().min(2).max(1000),
  cost: z.number().min(0).nullable().optional(),
  status: z.enum(['requested', 'completed']).default('completed'),
  notes: z.string().max(1000).optional(),
});

const updateServiceSchema = serviceSchema.partial();

async function listServices(req, res, next) {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    // Verify product ownership
    const product = await Product.findOne({ _id: productId, ownerId: req.userId });
    if (!product) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    const services = await ServiceRecord.find({ productId, ownerId: req.userId }).sort({ serviceDate: -1 });
    return res.json({ data: { services } });
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    // Verify product ownership - prevent inserting child records under another user's product
    const product = await Product.findOne({ _id: productId, ownerId: req.userId });
    if (!product) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
      });
    }

    const service = await ServiceRecord.create({
      ...parsed.data,
      ownerId: req.userId,
      productId,
    });

    return res.status(201).json({ data: { service } });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid service record ID.' } });
    }

    const parsed = updateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
      });
    }

    const service = await ServiceRecord.findOneAndUpdate(
      { _id: id, ownerId: req.userId },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service record not found.' } });
    }

    return res.json({ data: { service } });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid service record ID.' } });
    }

    const service = await ServiceRecord.findOneAndDelete({ _id: id, ownerId: req.userId });
    if (!service) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service record not found.' } });
    }

    return res.json({ data: { message: 'Service record deleted successfully.' } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices, createService, updateService, deleteService };
