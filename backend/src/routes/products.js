'use strict';
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { listReceipts, uploadReceipt } = require('../controllers/receiptController');
const { listServices, createService } = require('../controllers/serviceController');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All product routes require auth
router.use(requireAuth);

router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Nested: receipts under product
router.get('/:id/receipts', listReceipts);
router.post('/:id/receipts', upload.single('receipt'), handleUploadError, uploadReceipt);

// Nested: services under product
router.get('/:id/services', listServices);
router.post('/:id/services', createService);

module.exports = router;
