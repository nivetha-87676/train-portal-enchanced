'use strict';

/**
 * RailYatra — Auth Controller
 */

const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const newUser = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      data: {
        user: newUser,
        token: `user:${newUser.id}`
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findByEmail(email);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token: `user:${user.id}`
      }
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
