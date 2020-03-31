const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../lib/hashing');
const owasp = require('owasp-password-strength-test');

// Login
router.post(
  '/login',
  ensureLogin.ensureLoggedOut(),
  passport.authenticate('local'),
  (req, res) => {
    // Return the logged in user
    return res.json(
      _.pick(req.user, ['username', '_id', 'company', 'name', 'type'])
    );
  }
);

// Generate token for password reset
router.post(
  '/reset-password',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { username } = req.body;
    const localUser = await LocalUser.findOne({ username });
    const clientUser = await ClientUser.findOne({ username });
    const user = localUser ? localUser : clientUser;

    if (user) {
      const secret = user.password + user.createdAt;
      const token = jwt.sign({ username }, secret, {
        expiresIn: 3600
      });
      const transporter = nodemailer.createTransport({
        service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
        auth: {
          user: process.env.MAILER_EMAIL_ID,
          pass: process.env.MAILER_PASSWORD
        }
      });
      const mailOptions = {
        from: process.env.MAILER_EMAIL_ID,
        to: username,
        subject: 'Subby Link to reset password',
        text: `Hi! use this token to reset your password ${token}` //change this for HTML template
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 'mail not sent', errors: error });
        } else {
          return res.json({ status: 'email sent', info: info });
        }
      });
    } else {
      return res.status(401).json({ status: 'user not found' });
    }
  }
);

// reset password
router.post(
  '/reset-password/:token',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { token } = req.params;
    const { username, password } = req.body;
    try {
      const localUser = await LocalUser.findOne({ username });
      const clientUser = await ClientUser.findOne({ username });
      const user = localUser ? localUser : clientUser;
      if (user) {
        const secret = user.password + user.createdAt;
        let decodedToken;
        jwt.verify(token, secret, function(err, decoded) {
          if (err) {
            return res
              .status(401)
              .json({ status: 'invalid token', errors: err });
          } else {
            decodedToken = decoded;
          }
        });
        if (user.username === username && decodedToken) {
          const errors = owasp.test(password).errors;
          if (errors.length == 0) {
            user.password = hashPassword(password);
            await user.save();
            return res.json({ status: 'Password changed correctly' });
          } else {
            return res.json({ status: 'invalid password', errors: errors });
          }
        } else {
          return res.status(401).json({ status: 'unathorized' });
        }
      } else {
        return res.status(401).json({ status: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
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

const company = require('./company');
router.use('/company', company);

module.exports = router;
