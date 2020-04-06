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
  date,
  planName,
  firstName,
  lastName
}) => {
  const res = await api.post('/auth/company/new-subscription', {
    username,
    date: new Date(date),
    planName,
    firstName,
    lastName
  });
  return res.data;
};

export const createPlanOrExtra = async ({ name, price, currency }, type) => {
  const res = await api.post('/auth/company/new-plan-or-extra', {
    name,
    price,
    currency,
    type
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

export const getPlans = async () => {
  const res = await api.get(`/retrieve/plans`);
  return res.data;
};

export const getSubscriptions = async () => {
  const res = await api.get(`/retrieve/subscriptions`);
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
  console.log('Login out');
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getUserLogged = async () => {
  const res = await api.get('/auth/loggedin');
  return res.data;
};
