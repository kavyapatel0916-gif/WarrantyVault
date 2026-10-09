'use strict';
const fs = require('fs');
const path = require('path');
const Receipt = require('../models/Receipt');
const ServiceRecord = require('../models/ServiceRecord');

/**
 * Delete a file from the filesystem safely.
 * Does not throw if file doesn't exist.
 * @param {string} filePath
 */
async function deleteFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`[cleanup] Failed to delete file ${filePath}:`, err.message);
    }
  }
}

/**
 * Delete all receipts (DB + files) for a product.
 * @param {string} productId
 */
async function cleanupProductReceipts(productId) {
  const receipts = await Receipt.find({ productId }).select('+storagePath');
  for (const receipt of receipts) {
    if (receipt.storagePath) {
      await deleteFile(receipt.storagePath);
    }
  }
  await Receipt.deleteMany({ productId });
}

/**
 * Delete all service records for a product.
 * @param {string} productId
 */
async function cleanupProductServiceRecords(productId) {
  await ServiceRecord.deleteMany({ productId });
}

/**
 * Full cascade delete for a product's children.
 * @param {string} productId
 */
async function cleanupProduct(productId) {
  await Promise.all([
    cleanupProductReceipts(productId),
    cleanupProductServiceRecords(productId),
  ]);
}

module.exports = { deleteFile, cleanupProductReceipts, cleanupProductServiceRecords, cleanupProduct };
