'use strict';

/**
 * RailYatra — Booking Controller
 */

const Booking = require('../models/Booking');
const Train = require('../models/Train');

const createBooking = async (req, res, next) => {
  try {
    const {
      trainNumber,
      from,
      to,
      travelDate,
      classType,
      passengers,
      totalFare,
      paymentMethod
    } = req.body;

    const train = await Train.findById(trainNumber);
    const trainName = train ? train.name : req.body.trainName || 'Express Special';

    const newBooking = await Booking.create({
      userId: req.user ? req.user.id : 'guest',
      trainNumber,
      trainName,
      from: from || (train ? train.fromStation : 'Source'),
      to: to || (train ? train.toStation : 'Destination'),
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      classType: classType || 'SL',
      passengers,
      totalFare,
      paymentMethod: paymentMethod || 'UPI'
    });

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      data: newBooking
    });
  } catch (err) {
    next(err);
  }
};

const getBookingByPNR = async (req, res, next) => {
  try {
    const pnr = req.params.pnr;
    const booking = await Booking.findByPNR(pnr);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found for PNR '${pnr}'.`
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'usr_001';
    const bookings = await Booking.findByUserId(userId);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingByPNR,
  getUserBookings
};
