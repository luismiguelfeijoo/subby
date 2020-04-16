const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const Company = require('../models/Company');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Extra = require('../models/Extra');
const { hashPassword } = require('../lib/hashing');
const owasp = require('owasp-password-strength-test');
const { newCompanyTemplate } = require('../templates/newCompany');
const { newUserTemplate } = require('../templates/newUser');

const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

// Generate register Token for new companies, ask for company and email
router.post('/', ensureLogin.ensureLoggedOut(), async (req, res, next) => {
  const { company, email } = req.body;

  const existingCompany = await Company.findOne({ name: company });

  if (!existingCompany) {
    const token = jwt.sign({ company, email }, process.env.JWTSECRET, {
      expiresIn: 3600,
    });

    const html = newCompanyTemplate({
      url: `http://localhost:1234/new-company/${token}`,
    });

    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: email,
      subject: 'Welcome to SUBBY, follow this steps to complete your register',
      html: html, //change this for HTML template
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ status: 'mail not sent', errors: error });
      } else {
        return res.json({
          status:
            'You will recieve an email with instructions to complete your registration!',
          info: info,
        });
      }
    });
  } else {
    return res
      .status(422)
      .json({ status: 'We can`t process your request currently' });
  }
});

// Register company on DB (And admin user)
router.post(
  '/signup/:token',
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { token } = req.params;
    const { password, firstName, lastName } = req.body;

    // Create the user, also check to wich company it belongs
    try {
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const check = decodedToken.company;
      if (check) {
        const existingCompany = await Company.findOne({ name: check });
        if (!existingCompany) {
          let errors = owasp.test(password).errors;
          if (errors.length == 0) {
            const newCompany = await Company.create({ name: check });
            let newUser = await LocalUser.create({
              username: decodedToken.email,
              password: hashPassword(password),
              name: {
                first: firstName,
                last: lastName,
              },
              type: 'admin',
              company: newCompany._id,
            });
            req.logIn(newUser, (err) => {
              return res.json(
                _.pick(req.user, [
                  'username',
                  '_id',
                  'company',
                  'name',
                  'type',
                  'phone',
                ])
              );
            });
            //return res.json({ status: 'Company & admin user created' });
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
          return res.status(401).json({ status: 'Not able to create company' });
        }
      }
      // if it get's here the token is valid
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
);

// Create new sub
router.post(
  '/new-subscription',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    const { username, dates, name, planName } = req.body;

    const plansPromises = await planName.map(async (plan) => {
      let result = await Plan.findOne({
        name: plan,
        company: loggedAdmin.company,
      });
      return result;
    });

    const plans = await Promise.all(plansPromises);

    const parent = await ClientUser.findOne({ username });
    if (loggedAdmin.type === 'admin') {
      const newSub = await Subscription.create({
        name,
        company: loggedAdmin.company, // id of the company
        plans: plans.map((plan, i) => {
          return { plan: plan._id, startDate: dates[i] };
        }), // see plan options
      });
      if (parent) {
        newSub.parents = [...newSub.parents, parent._id];
        await newSub.save();
        parent.subscriptions = [...parent.subscriptions, newSub._id];
        await parent.save();
      }
      return res.json({ status: 'Subscription created' });
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

    if (loggedAdmin.type === 'admin') {
      const existingUser =
        type === 'admin' || type === 'coordinator'
          ? await LocalUser.findOne({ username })
          : await ClientUser.findOne({ username });

      if (!existingUser) {
        const token = jwt.sign(
          { id: company._id, username, type },
          process.env.JWTSECRET,
          {
            expiresIn: 3600,
          }
        );

        const html = newUserTemplate({
          url: `http://localhost:1234/new-user/${token}`,
          company: company.name,
        });

        const mailOptions = {
          from: process.env.MAILER_EMAIL_ID,
          to: username,
          subject: `${company.name} invited you to join SUBBY!`,
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
                'Email sent. The user will recieve a link to complete registration',
              info: info,
            });
          }
        });
      } else {
        return res.status(401).json({ status: 'User already exists' });
      }
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
    const { password, firstName, lastName, phone } = req.body;
    // Create the user, also check to wich company it belongs
    try {
      const decodedToken = jwt.verify(token, process.env.JWTSECRET);
      const existingUser =
        decodedToken.type === 'client'
          ? await ClientUser.findOne({ username: decodedToken.username })
          : await LocalUser.findOne({ username: decodedToken.username });
      if (!existingUser) {
        const errors = owasp.test(password).errors;
        if (errors.length == 0) {
          if (decodedToken.type === 'admin') {
            const newUser = await LocalUser.create({
              username: decodedToken.username,
              password: hashPassword(password),
              name: {
                first: firstName,
                last: lastName,
              },
              type: 'admin',
              company: decodedToken.id,
            });
            return res.json({ status: 'New Admin User Created' });
          } else if (decodedToken.type === 'coordinator') {
            const newUser = await LocalUser.create({
              username: decodedToken.username,
              password: hashPassword(password),
              name: {
                first: firstName,
                last: lastName,
              },
              type: 'coordinator',
              company: decodedToken.id,
            });
            return res.json({ status: 'New Coordinator User Created' });
          } else if (decodedToken.type === 'client') {
            const newUser = await ClientUser.create({
              username: decodedToken.username,
              password: hashPassword(password),
              name: {
                first: firstName,
                last: lastName,
              },
              phone,
              company: decodedToken.id,
            });
            return res.json({ status: 'New Client User Created' });
          }
        } else {
          return res.json({ status: 'invalid password', errors: errors });
        }
      } else {
        return res.status(401).json({ status: 'Not able to create user' });
      }
    } catch (error) {
      // if it get's here the token is invalid
      return res.status(401).json({ errors: error });
    }
  }
);

module.exports = router;
