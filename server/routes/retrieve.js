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
const moment = require('moment');
// Retrieve all the plans

router.get('/plans', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const plans = await Plan.find({
      company: loggedAdmin.company,
      active: true,
    });
    return res.json(plans);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.get(
  '/plans/delete/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    if (loggedAdmin.type === 'admin') {
      const plan = await Plan.findByIdAndUpdate(id, { active: false });
      return res.json({
        status: 'Plan deleted, this will not affect charged plans',
      });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.get('/extras', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const extras = await Extra.find({
      company: loggedAdmin.company,
      active: true,
    });
    return res.json(extras);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.get(
  '/extras/delete/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    if (loggedAdmin.type === 'admin') {
      const extra = await Extra.findByIdAndUpdate(id, { active: false });
      return res.json({
        status: 'Extra deleted, this will not affect charged extras',
      });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.get('/clients', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const clients = await ClientUser.find({
      company: loggedAdmin.company,
    }).populate({
      path: 'subscriptions',
      populate: ['plans.plan', 'extras.extra'],
    });
    clients.map(async (client) => {
      client.subscriptions.map(async (sub) => {
        if (sub.active) {
          sub.extras.map(async (extra) => {
            if (!extra.charged) {
              if (
                moment().isSame(moment(extra.date), 'month') ||
                moment().isAfter(moment(extra.date), 'month')
              ) {
                client.debts = [
                  ...client.debts,
                  {
                    type: 'extra',
                    date: extra.date,
                    amount: {
                      price: extra.extra.price.price.concat('.00'),
                      currency: extra.extra.price.currency,
                    },
                    name: extra.extra.name,
                    subscription: sub.name,
                  },
                ];
                extra.charged = true;
              }
            }
          });
          sub.plans.map(async (plan) => {
            const startOfNextMonth = moment([
              moment().year(),
              moment().month() + 1,
              2,
            ]).toDate();
            //const proof = moment(new Date('2020-06-01')).toDate(); this is to make tests
            console.log(startOfNextMonth);
            const isStartOfMonth =
              moment().diff(moment().endOf('month'), 'day') === 1;

            if (isStartOfMonth) {
              plan.charged = false;
            }
            if (!plan.charged) {
              if (
                moment().isSame(moment(plan.startDate), 'month') ||
                moment().isAfter(moment(plan.startDate), 'month')
              ) {
                const monthsSinceStart = moment(startOfNextMonth).diff(
                  moment(plan.startDate),
                  'months',
                  true
                );

                let monthsToCharge =
                  plan.timesCharged === 0
                    ? (monthsSinceStart - plan.timesCharged).toFixed(1)
                    : 1;

                let monthCount = 0;

                while (monthsToCharge > 0) {
                  console.log('monthToCharge', monthsToCharge);

                  let date = new Date();

                  date = moment(
                    date.setYear(plan.startDate.getFullYear())
                  ).toDate();

                  date = moment(
                    date.setMonth(plan.startDate.getMonth() - monthCount)
                  )
                    .endOf('month')
                    .toDate();

                  date = moment(date).startOf('day').toDate();

                  let fraction =
                    monthsToCharge % 1 == 0 ? 1 : monthsToCharge % 1;
                  console.log('fraction', fraction);
                  client.debts = [
                    ...client.debts,
                    {
                      type: 'plan',
                      date: date,
                      amount: {
                        price: Math.floor(
                          plan.plan.price.price * fraction
                        ).toFixed(2),
                        currency: plan.plan.price.currency,
                      },
                      name: plan.plan.name,
                      subscription: sub.name,
                    },
                  ];
                  monthCount--;
                  monthsToCharge -= fraction;
                }

                plan.charged = true;
                plan.timesCharged = monthsSinceStart;
              }
            }
          });
        }
        await sub.save();
      });
      await client.save();
    });

    return res.json(clients);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.post(
  '/clients/add-payment/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedAdmin = req.user;
    const { paymentAmount, paymentDate, currency, description } = req.body;

    if (loggedAdmin.type === 'admin') {
      const updateClient = await ClientUser.findById(id);

      updateClient.payments = [
        ...updateClient.payments,
        {
          date: paymentDate,
          amount: { price: paymentAmount, currency: currency },
          description,
        },
      ];

      await updateClient.save();

      return res.json({ status: 'Payment Added' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.get(
  '/clients/:id',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const { id } = req.params;
    const loggedUser = req.user;
    try {
      if (loggedUser.type === 'admin' || loggedUser.type === 'coordinator') {
        const client = await ClientUser.findById(id).populate({
          path: 'subscriptions',
          populate: ['plans.plan', 'extras.extra', 'debts.data'],
        });
        return res.json(client);
      } else if (String(loggedUser._id) === String(id)) {
        const client = await ClientUser.findById(id).populate({
          path: 'subscriptions',
          populate: ['plans.plan', 'extras.extra', 'debts.data'],
        });
        return res.json(
          _.pick(client, [
            'name',
            'debts',
            'subscriptions',
            'username',
            'payments',
          ])
        );
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
      const client = await ClientUser.findByIdAndDelete(id);
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
        company: loggedAdmin.company,
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
    const loggedUser = req.user;
    const subscription = await Subscription.findById(id)
      .populate('parents')
      .populate({ path: 'plans.plan' })
      .populate({ path: 'extras.extra' });
    try {
      if (loggedUser.type === 'admin' || loggedUser.type === 'coordinator') {
        return res.json(subscription);
      } else if (
        String(loggedUser._id) === String(subscription.parents[0]._id)
      ) {
        return res.json(subscription);
      } else {
        return res.status(401).json({ status: 'User is not allowed' });
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
      const subscription = await Subscription.findById(id);
      subscription.plans.map((plan) => {
        plan.endDate = new Date();
      });
      subscription.active = false;
      subscription.save();
      /* Used for deletign subscription from parents
      const parentIds = subscription.parents.map(parent => parent._id);
      const updatedPromises = await parentIds.map(async parentID => {
        let result = await ClientUser.findByIdAndUpdate(parentID, {
          $pull: { subscriptions: id }
        });
        return result;
      });
      const updated = await Promise.all(updatedPromises);
      */
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
    const { username, plansName, name } = req.body;
    let { planDates } = req.body;

    if (loggedAdmin.type === 'admin') {
      const updateSub = await Subscription.findById(id);
      updateSub.name = name;
      await updateSub.save();
      if (plansName.length > 0) {
        const plansPromises = await plansName.map(async (plan) => {
          let result = await Plan.findOne({
            name: plan,
            company: loggedAdmin.company,
          });
          return result;
        });

        let plans = await Promise.all(plansPromises);

        // To update existing plans
        let prevAddedPlans = [];
        let datesToChange = [];
        // To delete plans from the existing array
        let indexesToRemove = [];
        // To remove new plans sent
        let datesToRemove = [];
        let newPlansToRemove = [];

        updateSub.plans.map((existingPlan, existingPlanIndex) => {
          const newDupPlan = _.find(
            plans,
            (element) => String(element._id) === String(existingPlan.plan)
          );
          if (newDupPlan) {
            const newDupPlanIndex = _.findIndex(
              plans,
              (element) => String(element._id) === String(existingPlan.plan)
            );
            if (
              !moment(existingPlan.startDate).isSame(
                planDates[newDupPlanIndex],
                'day'
              )
            ) {
              prevAddedPlans.push(newDupPlan);
              datesToChange.push(planDates[newDupPlanIndex]);
              newPlansToRemove.push(newDupPlanIndex);
              datesToRemove.push(newDupPlanIndex);
              indexesToRemove.push(existingPlanIndex);
            } else {
              newPlansToRemove.push(newDupPlanIndex);
              datesToRemove.push(newDupPlanIndex);
            }
          } else {
            indexesToRemove.push(existingPlanIndex);
          }
        });

        updateSub.plans = updateSub.plans.filter(
          (plan, i) => !indexesToRemove.includes(i)
        );
        await updateSub.save();

        plans =
          plans.length > 0
            ? plans.filter((plan, i) => !newPlansToRemove.includes(i))
            : [...plans];
        console.log('planDates', planDates);
        planDates =
          datesToRemove.length > 0
            ? (planDates = planDates.filter(
                (date, i) => !datesToRemove.includes(i)
              ))
            : [...planDates];

        console.log('new plans', plans);
        updateSub.plans = [
          ...updateSub.plans,
          ...plans.map((plan, i) => {
            return { plan: plan._id, startDate: planDates[i] };
          }),
        ];

        await updateSub.save();
        console.log('prevaddedplans', prevAddedPlans);
        updateSub.plans = [
          ...updateSub.plans,
          ...prevAddedPlans.map((plan, i) => {
            return { plan: plan._id, startDate: datesToChange[i] };
          }),
        ];
        await updateSub.save();
      } else {
        updateSub.plans = [];
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
        company: loggedAdmin.company,
      });

      updateSub.extras = [
        ...updateSub.extras,
        { extra: extra._id, date: extraDate },
      ];

      await updateSub.save();

      return res.json({ status: 'Subscription updated' });
    } else {
      return res.status(401).json({ status: 'Local user is not admin' });
    }
  }
);

router.get('/company', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const loggedAdmin = req.user;
  if (loggedAdmin.type === 'admin' || loggedAdmin.type === 'coordinator') {
    const company = await Company.findById(loggedAdmin.company)
      .populate('plans')
      .populate('extras');
    return res.json(company);
  } else {
    return res.status(401).json({ status: 'Local user is not admin' });
  }
});

router.post(
  '/new-plan',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    const { price, name, currency } = req.body;
    if (loggedAdmin.type === 'admin') {
      const newPlan = await Plan.create({
        name,
        price: { price, currency },
        company: loggedAdmin.company, // id of the company
      });
      const company = await Company.findById(loggedAdmin.company);
      company.plans = [...company.plans, newPlan._id];
      company.save();
      return res.json({ status: 'Plan created' });
    }
  }
);

router.post(
  '/new-extra',
  ensureLogin.ensureLoggedIn(),
  async (req, res, next) => {
    const loggedAdmin = req.user;
    const { price, name, currency } = req.body;
    if (loggedAdmin.type === 'admin') {
      const newExtra = await Extra.create({
        name,
        price: { price, currency },
        company: loggedAdmin.company, // id of the company
      });
      const company = await Company.findById(loggedAdmin.company);
      company.extras = [...company.extras, newExtra._id];
      company.save();
      return res.json({ status: 'Extra created' });
    }
  }
);

module.exports = router;
