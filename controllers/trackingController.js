'use strict';

/**
 * RailYatra — Live Train Tracking Controller
 */

const Train = require('../models/Train');

const getLiveStatus = async (req, res, next) => {
  try {
    const { trainNumber } = req.params;
    const status = await Train.getLiveStatus(trainNumber);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: `Train '${trainNumber}' not found for live tracking.`
      });
    }

    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    next(err);
  }
};

const getStationCoordinates = async (req, res, next) => {
  try {
    const { trainNumber } = req.params;
    const train = await Train.findById(trainNumber);

    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train '${trainNumber}' not found.`
      });
    }

    const stations = train.route.map((r) => ({
      code: r.code,
      station: r.station,
      lat: r.lat,
      lng: r.lng,
      arr: r.arr,
      dep: r.dep,
      distance: r.distance
    }));

    res.json({
      success: true,
      trainNumber: train.trainNumber,
      trainName: train.name,
      stations
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLiveStatus,
  getStationCoordinates
};
