'use strict';

/**
 * RailYatra — Train Routes
 * Base path: /api/trains
 */

const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

// GET /api/trains/search — Search trains by criteria
router.get('/search', trainController.searchTrains);

// GET /api/trains — Get all trains
router.get('/', trainController.getAllTrains);

// GET /api/trains/:id — Get train details by ID or train number
router.get('/:id', trainController.getTrainById);

module.exports = router;
