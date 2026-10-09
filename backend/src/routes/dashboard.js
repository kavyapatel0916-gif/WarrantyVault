'use strict';
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.use(requireAuth);

router.get('/summary', getSummary);

module.exports = router;
