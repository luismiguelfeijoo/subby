import {
  getSubscriptions,
  getExtras,
  getClients,
  getPlans
} from '../../../lib/auth.api';

export const fetchSubscriptions = setter => {
  getSubscriptions().then(subs => {
    setter(subs.filter(sub => sub.active));
  });
};

export const fetchPlans = () => {
  getPlans()
    .then(plans => {
      setPlans(plans);
    })
    .catch(error => {
      console.log(error);
    });
};

export const fetchExtras = () => {
  getExtras()
    .then(extras => {
      setExtras(extras);
    })
    .catch(error => {
      console.log(error);
    });
};
