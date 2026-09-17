'use strict';

/**
 * RailYatra — Train Controller
 */

const Train = require('../models/Train');

const getAllTrains = async (req, res, next) => {
  try {
    const trains = await Train.findAll();
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (err) {
    next(err);
  }
};

const getTrainById = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train '${req.params.id}' not found.`
      });
    }
    res.json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

const searchTrains = async (req, res, next) => {
  try {
    const { from, to, date, classType } = req.query;
    const results = await Train.search({ from, to, date, classType });
    res.json({
      success: true,
      query: { from, to, date, classType },
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTrains,
  getTrainById,
  searchTrains
};
