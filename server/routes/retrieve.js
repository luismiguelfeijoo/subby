const express = require('express');
const router = express.Router();
const _ = require('lodash');
const ensureLogin = require('connect-ensure-login');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const Company = require('../models/Company');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Extra = require('../models/Extra');
const owasp = require('owasp-password-strength-test');

// Retrieve all the plans

router.get('/plans', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const plans = await Plan.find({ company: loggedAdmin.company });
    return res.json(plans);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.get('/extras', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const extras = await Extra.find({ company: loggedAdmin.company });
    return res.json(extras);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.get('/clients', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const clients = await ClientUser.find({ company: loggedAdmin.company });
    return res.json(clients);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.get(
  '/subscriptions',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
      const subscriptions = await Subscription.find({
        company: loggedAdmin.company
      }).populate('parents');
      return res.json(subscriptions);
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

module.exports = router;
