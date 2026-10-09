'use strict';
const Product = require('../models/Product');
const { computeWarranty } = require('../services/warrantyService');

async function getSummary(req, res, next) {
  try {
    const ownerId = req.userId;
    const today = new Date().toISOString().slice(0, 10);
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [total, activeCount, expiringCount, expiredCount, upcomingProducts] = await Promise.all([
      Product.countDocuments({ ownerId }),
      Product.countDocuments({ ownerId, warrantyExpiryDate: { $gt: in30Days } }),
      Product.countDocuments({ ownerId, warrantyExpiryDate: { $gte: today, $lte: in30Days } }),
      Product.countDocuments({ ownerId, warrantyExpiryDate: { $lt: today } }),
      Product.find({ ownerId, warrantyExpiryDate: { $gte: today } })
        .sort({ warrantyExpiryDate: 1 })
        .limit(10),
    ]);

    const upcoming = upcomingProducts.map((p) => {
      const { daysRemaining, status, reminderDays } = computeWarranty(p.purchaseDate, p.warrantyMonths);
      return {
        _id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        warrantyExpiryDate: p.warrantyExpiryDate,
        daysRemaining,
        warrantyStatus: status,
        reminderDays,
      };
    });

    return res.json({
      data: {
        summary: { total, active: activeCount, expiring: expiringCount, expired: expiredCount },
        upcoming,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
