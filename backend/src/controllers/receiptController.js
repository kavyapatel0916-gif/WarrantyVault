'use strict';
const path = require('path');
const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const Product = require('../models/Product');
const { runOCR } = require('../services/ocrService');
const { deleteFile } = require('../services/cleanupService');

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listReceipts(req, res, next) {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    // Verify ownership of product
    const product = await Product.findOne({ _id: productId, ownerId: req.userId });
    if (!product) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    const receipts = await Receipt.find({ productId, ownerId: req.userId }).sort({ createdAt: -1 });
    return res.json({ data: { receipts } });
  } catch (err) {
    next(err);
  }
}

async function uploadReceipt(req, res, next) {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid product ID.' } });
    }

    // Verify ownership
    const product = await Product.findOne({ _id: productId, ownerId: req.userId });
    if (!product) {
      // Clean up uploaded temp file if product not found
      if (req.file) await deleteFile(req.file.path);
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
    }

    if (!req.file) {
      return res.status(400).json({ error: { code: 'NO_FILE', message: 'No file was uploaded.' } });
    }

    const receipt = await Receipt.create({
      ownerId: req.userId,
      productId,
      originalName: req.file.originalname,
      safeStoredName: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      storagePath: req.file.path,
    });

    // Don't return storagePath
    const { storagePath: _, ...receiptObj } = receipt.toObject();
    return res.status(201).json({ data: { receipt: receiptObj } });
  } catch (err) {
    if (req.file) await deleteFile(req.file.path);
    next(err);
  }
}

async function downloadReceipt(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid receipt ID.' } });
    }

    const receipt = await Receipt.findOne({ _id: id, ownerId: req.userId }).select('+storagePath');
    if (!receipt) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Receipt not found.' } });
    }

    // Serve file with Content-Disposition attachment
    return res.download(receipt.storagePath, receipt.originalName, (err) => {
      if (err && !res.headersSent) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
}

async function runReceiptOCR(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid receipt ID.' } });
    }

    const receipt = await Receipt.findOne({ _id: id, ownerId: req.userId }).select('+storagePath');
    if (!receipt) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Receipt not found.' } });
    }

    // Only support image OCR
    if (receipt.mimeType === 'application/pdf') {
      await Receipt.findByIdAndUpdate(id, { ocrStatus: 'failed' });
      return res.status(422).json({
        error: {
          code: 'PDF_OCR_NOT_SUPPORTED',
          message: 'OCR is not supported for PDF files in this version. PDF upload and download work correctly. For OCR, please use a JPEG, PNG, or WEBP image.',
        },
      });
    }

    // Mark as pending
    await Receipt.findByIdAndUpdate(id, { ocrStatus: 'pending' });

    try {
      const { rawText, candidates, confidence } = await runOCR(receipt.storagePath, receipt.mimeType);

      await Receipt.findByIdAndUpdate(id, {
        ocrStatus: 'complete',
        ocrRawText: rawText,
        ocrCandidates: candidates,
      });

      return res.json({
        data: {
          ocrStatus: 'complete',
          rawText,
          candidates,
          confidence: Math.round(confidence),
          note: 'All extracted fields are tentative. Please review and correct before saving.',
        },
      });
    } catch (ocrErr) {
      await Receipt.findByIdAndUpdate(id, { ocrStatus: 'failed' });
      return res.status(422).json({
        error: {
          code: 'OCR_FAILED',
          message: `OCR processing failed: ${ocrErr.message}`,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteReceipt(req, res, next) {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid receipt ID.' } });
    }

    const receipt = await Receipt.findOne({ _id: id, ownerId: req.userId }).select('+storagePath');
    if (!receipt) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Receipt not found.' } });
    }

    // Delete file from disk first, then DB record
    if (receipt.storagePath) {
      await deleteFile(receipt.storagePath);
    }
    await Receipt.deleteOne({ _id: id });

    return res.json({ data: { message: 'Receipt deleted successfully.' } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listReceipts, uploadReceipt, downloadReceipt, runReceiptOCR, deleteReceipt };
