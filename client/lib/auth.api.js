import axios from 'axios';
import React, { useContext } from 'react';

export const UserContext = React.createContext();

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

//Review every api

export const askCompanyToken = async ({ company, email }) => {
  const res = await api.post('/auth/company', {
    email,
    company
  });
  return res.data;
};

export const doCompanySignup = async (
  { username, firstName, lastName, password },
  token
) => {
  const res = await api.post(`/auth/company/signup/${token}`, {
    firstName,
    lastName,
    password
  });
  return res.data;
};

export const askUserToken = async ({ username, type }) => {
  const res = await api.post('/auth/company/new-user', {
    username,
    type
  });
  return res.data;
};

export const doUserSignup = async (
  { password, firstName, lastName, phone, prefix },
  token
) => {
  const res = await api.post(`/auth/company/new-user/${token}`, {
    password,
    firstName,
    lastName,
    phone: { prefix, phone }
  });
  return res.data;
};

export const createSubscription = async ({
  username,
  dates,
  planName,
  name
}) => {
  const res = await api.post('/auth/company/new-subscription', {
    username,
    dates,
    planName,
    name
  });
  return res.data;
};

export const askPasswordToken = async ({ username }) => {
  const res = await api.post('/auth/reset-password', {
    username
  });
  return res.data;
};

export const doPasswordReset = async ({ password }, token, id) => {
  const res = await api.post(`/auth/reset-password/${id}/${token}`, {
    password
  });
  return res.data;
};

export const updateUser = async ({
  username,
  firstName,
  lastName,
  prefix,
  phone
}) => {
  const res = await api.post('/auth/edit', {
    username,
    firstName,
    lastName,
    prefix,
    phone
  });
  return res.data;
};

export const createPlan = async ({ name, price, currency }) => {
  const res = await api.post('/retrieve/new-plan', {
    name,
    price,
    currency
  });
  return res.data;
};

export const createExtra = async ({ name, price, currency }) => {
  const res = await api.post('/retrieve/new-extra', {
    name,
    price,
    currency
  });
  return res.data;
};

export const getPlans = async () => {
  const res = await api.get(`/retrieve/plans`);
  return res.data;
};

export const deletePlan = async id => {
  const res = await api.get(`/retrieve/plans/delete/${id}`);
  return res.data;
};

export const getExtras = async () => {
  const res = await api.get(`/retrieve/extras`);
  return res.data;
};

export const deleteExtra = async id => {
  const res = await api.get(`/retrieve/extras/delete/${id}`);
  return res.data;
};

export const getSubscriptions = async () => {
  const res = await api.get(`/retrieve/subscriptions`);
  return res.data;
};

export const getSingleSubscription = async id => {
  const res = await api.get(`/retrieve/subscriptions/${id}`);
  return res.data;
};

export const deleteSubscription = async id => {
  const res = await api.get(`/retrieve/subscriptions/delete/${id}`);
  return res.data;
};

export const updateSubscription = async (
  id,
  { username, name, plansName, planDates }
) => {
  const res = await api.post(`retrieve/subscriptions/edit/${id}`, {
    username,
    name,
    plansName,
    planDates
  });
  return res.data;
};

export const addExtraOnSubscription = async (id, { extraName, extraDate }) => {
  const res = await api.post(`retrieve/subscriptions/addExtra/${id}`, {
    extraName,
    extraDate
  });
  return res.data;
};

export const getCompany = async () => {
  const res = await api.get(`/retrieve/company`);
  return res.data;
};

export const getClients = async () => {
  const res = await api.get(`/retrieve/clients`);
  return res.data;
};

export const getSingleClient = async id => {
  const res = await api.get(`/retrieve/clients/${id}`);
  return res.data;
};

export const deleteClient = async id => {
  const res = await api.post(`/retrieve/clients/delete/${id}`);
  return res.data;
};

export const addPaymentOnClient = async (
  id,
  { paymentDate, paymentAmount, currency, description }
) => {
  const res = await api.post(`retrieve/clients/add-payment/${id}`, {
    paymentDate,
    paymentAmount,
    currency,
    description
  });
  return res.data;
};

export const doLogin = async ({ username, password }) => {
  const res = await api.post('/auth/login', {
    username,
    password
  });
  return res.data;
};

export const doUpload = async file => {
  const data = new FormData();
  data.append('image', file);
  const res = await api.post('/auth/upload', data);
  return res.data;
};

export const doEdit = async ({ username, course, campus }) => {
  const res = await api.post('/auth/edit', {
    username,
    course,
    campus
  });
  return res.data;
};

export const doLogout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getUserLogged = async () => {
  const res = await api.get('/auth/loggedin');
  return res.data;
};
