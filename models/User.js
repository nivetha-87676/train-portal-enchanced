'use strict';

/**
 * RailYatra — User Data Model
 */

const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const cleanEmail = String(email).trim().toLowerCase();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  static async findById(id) {
    return db.users.find((u) => u.id === String(id)) || null;
  }

  static async create({ name, email, password, phone }) {
    const user = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password, // plain for demo; in production hashed with bcrypt
      phone: phone ? phone.trim() : '',
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    };
  }
}

module.exports = User;
