'use strict';

/**
 * RailYatra — Global Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
