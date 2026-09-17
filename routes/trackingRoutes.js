'use strict';

/**
 * RailYatra — Live Tracking Routes
 * Base path: /api/tracking
 */

const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// GET /api/tracking/:trainNumber — Get live running status
router.get('/:trainNumber', trackingController.getLiveStatus);

// GET /api/tracking/:trainNumber/stations — Get route coordinates & station stops
router.get('/:trainNumber/stations', trackingController.getStationCoordinates);

module.exports = router;
