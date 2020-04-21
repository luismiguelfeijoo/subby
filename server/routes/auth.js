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
const { newPasswordTemplate } = require('../templates/newPassword');

// Login
router.post(
  '/login',
  ensureLogin.ensureLoggedOut(),
  passport.authenticate('local'),
  (req, res) => {
    // Return the logged in user
    return req.user.type
      ? res.json(
          _.pick(req.user, ['username', '_id', 'company', 'name', 'type'])
        )
      : res.json(
          _.pick(req.user, ['username', '_id', 'company', 'name', 'phone'])
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
        expiresIn: 600,
      });

      const transporter = nodemailer.createTransport({
        service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
        auth: {
          user: process.env.MAILER_EMAIL_ID,
          pass: process.env.MAILER_PASSWORD,
        },
      });

      const html = newPasswordTemplate({
        url: `${process.env.FRONT_URL}/reset-password/${user._id}/${token}`,
        name: user.name.first,
      });

      const mailOptions = {
        from: process.env.MAILER_EMAIL_ID,
        to: username,
        subject: 'Subby Link to reset password',
        html: html,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 'mail not sent', errors: error });
        } else {
          return res.json({
            status:
              'You will recieve an email with instructions to reset your password!',
            info: info,
          });
        }
      });
    } else {
      return res.status(401).json({ status: 'user not found' });
    }
  }
);

// reset password
router.post(
  '/reset-password/:id/:token',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
      const localUser = await LocalUser.findById(id);
      const clientUser = await ClientUser.findById(id);
      const user = localUser ? localUser : clientUser;
      if (user) {
        const secret = user.password + user.createdAt;
        const decodedToken = jwt.verify(token, secret);
        console.log(decodedToken, secret);
        if (user.username === decodedToken.username) {
          let errors = owasp.test(password).errors;
          if (errors.length == 0) {
            user.password = hashPassword(password);
            await user.save();
            req.logIn(user, (err) => {
              return req.user.type
                ? res.json(
                    _.pick(req.user, [
                      'username',
                      '_id',
                      'company',
                      'name',
                      'type',
                    ])
                  )
                : res.json(
                    _.pick(req.user, [
                      'username',
                      '_id',
                      'company',
                      'name',
                      'phone',
                    ])
                  );
            });
          } else {
            errors = errors.reduce((acc, error) => {
              acc = acc
                .substring(0, acc.length - 1)
                .replace('The password', 'It');
              return `${acc} & ${error}`;
            });
            return res
              .status(412)
              .json({ status: `Invalid password: ${errors}` });
          }
        } else {
          return res.status(401).json({ status: 'unathorized' });
        }
      } else {
        return res.status(401).json({ status: 'User not found' });
      }
    } catch (error) {
      return res.status(401).json({ error: error });
    }
  }
);

// Update user fields
router.post('/edit', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  // const { ...fields } = req.body;
  const loggedUser = req.user;
  const { username, firstName, lastName, phone, prefix } = req.body;
  try {
    const localUser = await LocalUser.findOne({ username });
    const clientUser = await ClientUser.findOne({ username });
    const existingUser = localUser ? localUser : clientUser;
    if (!existingUser || existingUser.username === loggedUser.username) {
      loggedUser.username = username;
      loggedUser.name = { first: firstName, last: lastName };
      if (loggedUser.type) loggedUser.phone = { phone, prefix };
      loggedUser.save();
      return req.user.type
        ? res.json({
            status: 'User updated',
            user: _.pick(req.user, [
              'username',
              '_id',
              'company',
              'name',
              'type',
            ]),
          })
        : res.json({
            status: 'User updated',
            user: _.pick(req.user, [
              'username',
              '_id',
              'company',
              'name',
              'phone',
            ]),
          });
    } else {
      res.status(401).json({ status: `You can't use that username` });
    }
  } catch (error) {
    console.log(error);
  }
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
  if (req.user)
    return res.json(
      _.pick(req.user, ['username', '_id', 'type', 'company', 'name', 'phone'])
    );
  else return res.status(401).json({ status: 'No user session present' });
});

const company = require('./company');
router.use('/company', company);

module.exports = router;
