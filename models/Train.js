'use strict';

/**
 * RailYatra — Train Data Model
 */

const db = require('../config/db');

class Train {
  static async findAll() {
    return db.trains;
  }

  static async findById(trainId) {
    return db.trains.find(
      (t) => t.id === String(trainId) || t.trainNumber === String(trainId)
    ) || null;
  }

  static async search({ from, to, date, classType }) {
    let results = [...db.trains];

    if (from) {
      const qFrom = from.trim().toLowerCase();
      results = results.filter(
        (t) =>
          t.from.toLowerCase().includes(qFrom) ||
          t.fromStation.toLowerCase().includes(qFrom)
      );
    }

    if (to) {
      const qTo = to.trim().toLowerCase();
      results = results.filter(
        (t) =>
          t.to.toLowerCase().includes(qTo) ||
          t.toStation.toLowerCase().includes(qTo)
      );
    }

    if (classType) {
      results = results.filter((t) =>
        t.classes.some((c) => c.code.toUpperCase() === classType.toUpperCase())
      );
    }

    return results;
  }

  static async getLiveStatus(trainNumber) {
    const train = await this.findById(trainNumber);
    if (!train) return null;

    return {
      trainNumber: train.trainNumber,
      name: train.name,
      status: train.currentStatus.status,
      delayMinutes: train.currentStatus.delayMinutes,
      currentStation: train.currentStatus.currentStation,
      currentStationName: train.currentStatus.currentStationName,
      speedKmH: train.currentStatus.speedKmH,
      lastUpdated: train.currentStatus.lastUpdated,
      route: train.route
    };
  }
}

module.exports = Train;
