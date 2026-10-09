'use strict';
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { updateService, deleteService } = require('../controllers/serviceController');

const router = express.Router();

router.use(requireAuth);

router.patch('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
