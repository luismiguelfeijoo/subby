const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const Company = require('../models/Company');
const Children = require('../models/Children');
const { hashPassword } = require('../lib/hashing');
const { asyncController } = require('../lib/asyncController');
const owasp = require('owasp-password-strength-test');

// Generate register Token for new companies, ask for company and email
router.post('/', ensureLogin.ensureLoggedOut(), async (req, res, next) => {
  const { company, email } = req.body;

  const token = jwt.sign({ company, email }, process.env.JWTSECRET, {
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
    to: email,
    subject: 'Subby Link to register your company',
    text: `Hi! welcome to subby, use this Token to set up your account: ${token}` //change this for HTML template
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({ status: 'mail not sent', errors: error });
    } else {
      return res.json({ status: 'email sent', info: info });
    }
  });
});

// Register company on DB (And admin user)
router.post(
  '/signup/:token',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { token } = req.params;
    const { username, password, firstName, lastName, companyName } = req.body;
    // Create the user, also check to wich company it belongs
    let decodedToken;
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
      if (err) {
        return res.status(401).json({ status: 'invalid token', errors: err });
      }
      decodedToken = decoded;
    });
    // if it get's here the token is valid
    const check = decodedToken.company === companyName;
    if (check) {
      const existingCompany = await Company.findOne({ name: companyName });
      if (!existingCompany) {
        const errors = owasp.test(password).errors;
        if (errors.length == 0) {
          const newCompany = await Company.create({ name: companyName });
          let newUser = await LocalUser.create({
            username,
            password: hashPassword(password),
            name: {
              first: firstName,
              last: lastName
            },
            type: 'admin',
            company: newCompany._id
          });
          return res.json({ status: 'Company & admin user created' });
        } else {
          return res.json({ status: 'invalid password', errors: errors });
        }
      } else {
        res.status(401).json({ status: 'Not able to create company' });
      }
    }
  }
);

// Create new children
router.post(
  '/new-children',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    const { username, plan, firstName, lastName } = req.body;
    parent = await ClientUser.findOne({ username });
    if (loggedAdmin.type === admin) {
      const newChildren = await Children.create({
        name: {
          first: firstName,
          last: lastName
        },
        company: loggedAdmin.company, // id of the company
        plan: plan // see plan options
      });
      if (parent) {
        newChildren.parents.push(parent._id);
        await newChildren.save();
      }
      return res.json({ status: 'children created' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

// Create token for new user registration (local or client)
router.post(
  '/new-user',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    const { username, type } = req.body;
    const company = await Company.findById(loggedAdmin.company);
    const secret = process.env.JWTSECRET + username;
    if (loggedAdmin.type === 'admin') {
      const token = jwt.sign({ company, username, type }, secret, {
        expiresIn: 60 * 15
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
        subject: 'Subby Link to register your company',
        text: `Hi! welcome to subby. ${loggedAdmin.company.name} has invited you to our platform. Use this Token to register: ${token}` //change this for HTML template
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
      return res
        .status(401)
        .json({ status: "You don't have permission to generate token" });
    }
  }
);

// Register the new user with the token params that where given
router.post(
  '/new-user/:token',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { token } = req.params;
    const { username, password, firstName, lastName, phone } = req.body;
    const secret = process.env.JWTSECRET + username;
    // Create the user, also check to wich company it belongs
    let decodedToken;
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(401).json({ status: 'invalid token', errors: err });
      }
      decodedToken = decoded;
    });
    // if it get's here the token is valid
    const existingUser = await ClientUser.findOne({ username });
    if (!existingUser) {
      const errors = owasp.test(password).errors;
      if (errors.length == 0) {
        if (decodedToken.type === 'admin') {
          const newUser = await LocalUser.create({
            username,
            password: hashPassword(password),
            name: {
              first: firstName,
              last: lastName
            },
            type: 'admin',
            company: decodedToken.company
          });
          return res.json({ status: 'New Admin User Created' });
        } else if (decodedToken.type === 'coordinator') {
          const newUser = await LocalUser.create({
            username,
            password: hashPassword(password),
            name: {
              first: firstName,
              last: lastName
            },
            type: 'coordinator',
            company: decodedToken.company
          });
          return res.json({ status: 'New Coordinator User Created' });
        } else if (decodedToken.type === 'user') {
          const newUser = await ClientUser.create({
            username,
            password: hashPassword(password),
            name: {
              first: firstName,
              last: lastName
            },
            phone,
            company: decodedToken.company
          });
          return res.json({ status: 'New Client User Created' });
        }
      } else {
        return res.json({ status: 'invalid password', errors: errors });
      }
    } else {
      res.status(401).json({ status: 'Not able to create user' });
    }
  }
);

module.exports = router;
