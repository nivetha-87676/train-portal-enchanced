'use strict';

/**
 * RailYatra — Application Configuration
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:8000', 'http://localhost:8080', 'http://127.0.0.1:8000', 'http://127.0.0.1:8080'],
  jwtSecret: process.env.JWT_SECRET || 'railyatra_default_dev_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
