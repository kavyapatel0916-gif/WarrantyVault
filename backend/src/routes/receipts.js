'use strict';
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { downloadReceipt, runReceiptOCR, deleteReceipt } = require('../controllers/receiptController');

const router = express.Router();

// All receipt operations require auth
router.use(requireAuth);

// Download/view a specific receipt (authenticated, ownership-checked)
router.get('/:id/download', downloadReceipt);

// OCR trigger for a specific receipt
router.post('/:id/ocr', runReceiptOCR);

// Delete a receipt
router.delete('/:id', deleteReceipt);

module.exports = router;
