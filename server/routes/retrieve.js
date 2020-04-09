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
  '/clients/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    try {
      if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
        const client = await ClientUser.findById(id).populate({
          path: 'subscriptions',
          populate: ['plans.plan', 'extras.extra']
        });
        return res.json(client);
      } else {
        return res.status(401).json({ status: 'User is not local' });
      }
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
);

router.get(
  '/clients/delete/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    if (loggedAdmin.type === 'admin') {
      const client = await Subscription.findByIdAndDelete(id);
      return res.json({ status: 'Client deleted' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

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
        return res.status(401).json({ status: 'User is not local' });
      }
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
);

router.get(
  '/subscriptions/delete/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    if (loggedAdmin.type === 'admin') {
      const subscriptions = await Subscription.findByIdAndDelete(id);
      return res.json({ status: 'Subscription deleted' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.post(
  '/subscriptions/edit/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    const { username, planDates, plansName, firstName, lastName } = req.body;

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

      return res.json({ status: 'Subscription updated' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.post(
  '/subscriptions/addExtra/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    const { extraName, extraDate } = req.body;

    if (loggedAdmin.type === 'admin') {
      const updateSub = await Subscription.findById(id);
      const extra = await Extra.findOne({
        name: extraName,
        company: loggedAdmin.company
      });
      console.log(extraName);
      updateSub.extras = [
        ...updateSub.extras,
        { extra: extra._id, date: extraDate }
      ];

      await updateSub.save();

      return res.json({ status: 'Subscription updated' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

module.exports = router;
