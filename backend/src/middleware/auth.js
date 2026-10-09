'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Auth middleware: verifies JWT from HttpOnly cookie and attaches user to req.
 */
async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.slice(7);
    }
    if (!token) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'Session expired or invalid. Please log in again.' } });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: { code: 'USER_NOT_FOUND', message: 'User account no longer exists.' } });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Issue JWT and set it as an HttpOnly cookie.
 * @param {import('express').Response} res
 * @param {string} userId
 */
function issueToken(res, userId) {
  const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
}

/**
 * Clear the auth cookie.
 * @param {import('express').Response} res
 */
function clearToken(res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
  });
}

module.exports = { requireAuth, issueToken, clearToken };
