const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const Company = require('../models/Company');
const { hashPassword } = require('../lib/hashing');
const { asyncController } = require('../lib/asyncController');
const owasp = require('owasp-password-strength-test');

// Generate register Token, ask for company and email

router.post('/', async (req, res, next) => {
  const { company, email } = req.body;
  console.log(email);
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
    } else {
      console.log('Email sent: ' + info.response);
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
          const newUser = await LocalUser.create({
            username,
            password: hashPassword(password),
            name: {
              first: firstName,
              last: lastName
            },
            type: 'admin'
          });
          return res.json({ status: 'Company & admin user created' });
        } else {
          return res.json({ status: 'invalid password', errors: errors });
        }
      }
    }
  }
);

module.exports = router;
