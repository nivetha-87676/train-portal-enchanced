'use strict';

/**
 * RailYatra — Backend Server Entry Point
 * 
 * Express REST API server providing services for:
 *  - Train schedules & live search
 *  - PNR generation & booking management
 *  - Live GPS tracking simulation
 *  - User authentication
 */

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/db');

// Route Handlers
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

// Middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware Setup ──
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (config.corsOrigins.indexOf(origin) !== -1 || config.env === 'development') {
      return callback(null, true);
    }
    callback(new Error('Blocked by CORS policy'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (config.env === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({
    service: 'RailYatra API Server',
    version: '1.0.0',
    status: 'ONLINE',
    documentation: '/api/docs',
    endpoints: {
      trains: '/api/trains',
      search: '/api/trains/search?from=NDLS&to=BSB',
      bookings: '/api/bookings',
      tracking: '/api/tracking/22436',
      auth: '/api/auth'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ── API Routes ──
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Server Bootstrap ──
const startServer = async () => {
  try {
    await db.connect();
    const server = app.listen(config.port, () => {
      console.log(`\n===========================================`);
      console.log(` RailYatra Backend API Server Started`);
      console.log(` Mode: ${config.env}`);
      console.log(` Port: ${config.port}`);
      console.log(` Local URL: http://localhost:${config.port}`);
      console.log(`===========================================\n`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start RailYatra server:', err);
    process.exit(1);
  }
};

// Start the server if called directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
