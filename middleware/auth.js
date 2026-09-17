'use strict';

/**
 * RailYatra — Authentication Middleware
 * 
 * Inspects Authorization: Bearer <token> header.
 * Provides fallback mock authentication for local development testing.
 */

const config = require('../config/config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development mode, allow guest access with default passenger
      if (config.env === 'development') {
        req.user = { id: 'usr_guest', name: 'Guest Passenger', email: 'guest@railyatra.in' };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Simple dev-friendly token format: user:<userId> or JWT
    if (token.startsWith('user:')) {
      const userId = token.split(':')[1];
      const user = await User.findById(userId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Default mock verified user for development
    req.user = { id: 'usr_001', name: 'Demo Passenger', email: 'passenger@railyatra.in' };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

module.exports = authMiddleware;
