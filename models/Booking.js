'use strict';

/**
 * RailYatra — Booking Data Model
 */

const db = require('../config/db');

class Booking {
  static generatePNR() {
    // Standard 10-digit Indian Railways PNR format: 3 digits + 7 digits
    const prefix = Math.floor(200 + Math.random() * 700);
    const suffix = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}${suffix}`;
  }

  static async create({
    userId,
    trainNumber,
    trainName,
    from,
    to,
    travelDate,
    classType,
    passengers,
    totalFare,
    paymentMethod = 'UPI'
  }) {
    const booking = {
      id: `bkg_${Date.now()}`,
      pnr: this.generatePNR(),
      userId: userId || 'guest',
      trainNumber,
      trainName,
      from,
      to,
      travelDate,
      classType,
      passengers: passengers.map((p, index) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference || 'No Preference',
        seatNumber: `${classType}-${index + 12}`,
        status: 'CNF'
      })),
      totalFare,
      paymentMethod,
      paymentStatus: 'COMPLETED',
      bookingDate: new Date().toISOString(),
      ticketStatus: 'CONFIRMED'
    };

    db.bookings.push(booking);
    return booking;
  }

  static async findByPNR(pnr) {
    const cleanPNR = String(pnr).trim();
    return db.bookings.find((b) => b.pnr === cleanPNR) || null;
  }

  static async findByUserId(userId) {
    return db.bookings.filter((b) => b.userId === String(userId));
  }

  static async findAll() {
    return db.bookings;
  }
}

module.exports = Booking;
