'use strict';

/**
 * RailYatra — Booking Routes
 * Base path: /api/bookings
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');
const { validateBookingRequest, validatePNRQuery } = require('../middleware/validator');

// POST /api/bookings — Book a new ticket
router.post('/', authMiddleware, validateBookingRequest, bookingController.createBooking);

// GET /api/bookings/pnr/:pnr — Check PNR status
router.get('/pnr/:pnr', validatePNRQuery, bookingController.getBookingByPNR);

// GET /api/bookings/my — Get bookings for the authenticated user
router.get('/my', authMiddleware, bookingController.getUserBookings);

module.exports = router;
