const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const { hashPassword } = require('../lib/hashing');
const { asyncController } = require('../lib/asyncController');
const owasp = require('owasp-password-strength-test');

// Register
router.post(
  '/signup',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { username, password } = req.body;
    // Create the user, also check to wich company it belongs
    const errors = owasp.test(password).errors;
    if (errors.length == 0) {
      return res.json({ status: 'correct password' });
    } else {
      return res.json({ status: 'invalid password', errors: errors });
    }
  }
);

// Login
router.post(
  '/login',
  ensureLogin.ensureLoggedOut(),
  passport.authenticate('local'),
  (req, res) => {
    // Return the logged in user
    return res.json(_.pick(req.user, ['username', '_id']));
  }
);

// Update user fields
router.post('/edit', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  // const { ...fields } = req.body;
  const loggedUser = req.user;

  // do comprobations add edit user
});

// Logout
router.post('/logout', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.user) {
    req.logout();
    return res.json({ status: 'Logged out' });
  } else {
    return res
      .status(401)
      .json({ status: 'You have to be logged in to logout' });
  }
});

// Check if the user is logged in
router.get('/loggedin', (req, res, next) => {
  if (req.user) return res.json(_.pick(req.user, ['username', '_id']));
  else return res.status(401).json({ status: 'No user session present' });
});

module.exports = router;
