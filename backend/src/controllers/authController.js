'use strict';
const { z } = require('zod');
const User = require('../models/User');
const { issueToken, clearToken } = require('../middleware/auth');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => e.message).join('; ') },
      });
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' },
      });
    }

    const user = new User({ name, email, passwordHash: password });
    await user.save();

    issueToken(res, user._id.toString());

    return res.status(201).json({ data: { user } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors.map((e) => e.message).join('; ') },
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      // Generic message to not leak whether email exists
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    issueToken(res, user._id.toString());

    // Return user without passwordHash
    const userObj = user.toJSON();
    return res.status(200).json({ data: { user: userObj } });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  clearToken(res);
  return res.status(200).json({ data: { message: 'Logged out successfully.' } });
}

async function me(req, res) {
  return res.status(200).json({ data: { user: req.user } });
}

module.exports = { register, login, logout, me };
