'use strict';

/**
 * RailYatra — Request Validator Middleware
 */

const validateBookingRequest = (req, res, next) => {
  const { trainNumber, passengers, totalFare, travelDate } = req.body;

  if (!trainNumber) {
    return res.status(400).json({
      success: false,
      message: 'trainNumber is required.'
    });
  }

  if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one passenger is required.'
    });
  }

  for (let i = 0; i < passengers.length; i++) {
    const p = passengers[i];
    if (!p.name || !p.age) {
      return res.status(400).json({
        success: false,
        message: `Passenger at index ${i} must have a name and age.`
      });
    }
  }

  if (!totalFare || Number(totalFare) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'A valid totalFare is required.'
    });
  }

  next();
};

const validatePNRQuery = (req, res, next) => {
  const pnr = req.params.pnr || req.query.pnr;
  if (!pnr) {
    return res.status(400).json({
      success: false,
      message: 'PNR number is required.'
    });
  }

  if (!/^\d{10}$/.test(String(pnr).trim())) {
    return res.status(400).json({
      success: false,
      message: 'PNR must be a 10-digit number.'
    });
  }

  next();
};

module.exports = {
  validateBookingRequest,
  validatePNRQuery
};
