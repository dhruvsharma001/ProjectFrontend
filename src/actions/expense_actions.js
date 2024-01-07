import { config } from '../siteDetails';
import axios from 'axios';

export const getExpenses = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}expense/get`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching expenses!'));
};
export const addExpense = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}expense/insertExpense`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding customer!'));
};

export const deleteExpense = (id, userId) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}expense/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id, userId },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error deleting customer!'));
};

export const editExpense = (data, id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}expense/edit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
