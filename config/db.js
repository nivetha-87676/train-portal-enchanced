'use strict';

/**
 * RailYatra — Database & Data Store Connection
 * 
 * Provides an in-memory JSON data store initialized with pre-seeded data,
 * with support for easy expansion to MongoDB/PostgreSQL.
 */

const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.trains = [];
    this.bookings = [];
    this.users = [];
    this.isInitialized = false;
  }

  async connect() {
    try {
      const seedPath = path.join(__dirname, '..', 'data', 'trains.json');
      if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf8');
        this.trains = JSON.parse(raw);
        console.log(`[DB] Successfully loaded ${this.trains.length} trains from data store.`);
      } else {
        console.warn('[DB] Warning: trains.json seed file not found. Initialized with empty trains list.');
        this.trains = [];
      }

      // Default demo users
      this.users = [
        {
          id: 'usr_001',
          name: 'Demo Passenger',
          email: 'passenger@railyatra.in',
          passwordHash: 'demo123', // In production, hashed with bcrypt
          phone: '+91 98765 43210',
          createdAt: new Date().toISOString()
        }
      ];

      this.isInitialized = true;
      console.log('[DB] In-memory persistence layer ready.');
      return true;
    } catch (err) {
      console.error('[DB] Connection error:', err.message);
      throw err;
    }
  }
}

const db = new Database();

module.exports = db;
