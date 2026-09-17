'use strict';

/**
 * RailYatra — Authentication Routes
 * Base path: /api/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register — Register new user
router.post('/register', authController.register);

// POST /api/auth/login — User login
router.post('/login', authController.login);

// GET /api/auth/profile — Get authenticated user's profile
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
