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
    const clients = await ClientUser.find({
      company: loggedAdmin.company
    }).populate('subscriptions');
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

router.get(
  '/subscriptions/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    try {
      if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
        const subscription = await Subscription.findById(id)
          .populate('parents')
          .populate({ path: 'plans.plan' })
          .populate({ path: 'extras.extra' });
        return res.json(subscription);
      } else {
        return res.status(401).json({ status: 'Local user is not admin' });
      }
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
);

router.post(
  '/subscriptions/edit/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    const {
      username,
      planDates,
      plansName,
      firstName,
      lastName,
      extrasName,
      extraDates
    } = req.body;

    if (loggedAdmin.type === 'admin') {
      const updateSub = await Subscription.findById(id);
      updateSub.name = { first: firstName, last: lastName };
      await updateSub.save();
      if (plansName.length > 0) {
        const plansPromises = await plansName.map(async plan => {
          let result = await Plan.findOne({
            name: plan,
            company: loggedAdmin.company
          });
          return result;
        });
        const plans = await Promise.all(plansPromises);
        updateSub.plans = plans.map((plan, i) => {
          return { plan: plan._id, startDate: planDates[i] };
        }); // see plan options
        await updateSub.save();
      }
      if (extrasName.length > 0) {
        const extrasPromises = await extrasName.map(async extra => {
          let result = await Extra.findOne({
            name: extra,
            company: loggedAdmin.company
          });
          return result;
        });
        const extras = await Promise.all(extrasPromises);

        updateSub.extras = extras.map((extra, i) => {
          return { extra: extra._id, date: extraDates[i] };
        });
        await updateSub.save();
      }
      return res.json({ status: 'Subscription updated' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

module.exports = router;
