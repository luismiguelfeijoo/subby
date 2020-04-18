import {
  getSubscriptions,
  getExtras,
  getClients,
  getPlans,
} from '../../../lib/auth.api';

export const fetchSubscriptions = (setter) => {
  getSubscriptions()
    .then((subs) => {
      setter(subs.filter((sub) => sub.active));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchPlans = () => {
  setLoading(true);
  getPlans()
    .then((plans) => {
      setPlans(plans);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(setLoading(false));
};

export const fetchExtras = () => {
  setLoading(true);
  getExtras()
    .then((extras) => {
      setExtras(extras);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(setLoading(false));
};

export const typeSub = {
  name: '',
  plan: '',
  extra: '',
  parents: [],
};

export const typeClient = {
  name: { first: '', last: '' },
  subscriptions: '',
  extras: '',
};
