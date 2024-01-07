
import { config } from '../siteDetails';
import axios from 'axios';

export const getProducts = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}products/get`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const addProduct = (data) => (dispatch) => {
  console.log('add data', data);
  return axios({
    method: 'POST',
    url: `${config.serverUrl}products/add`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const deleteProduct = (data) => (dispatch) => {
  console.log(data, 'delete data');
  return axios({
    method: 'POST',
    url: `${config.serverUrl}products/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const editProduct = (data, id) => (dispatch) => {
  console.log(data, 'edit data');

  return axios({
    method: 'PUT',
    url: `${config.serverUrl}products/edit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const editInventory = (data, id) => (dispatch) => {
  // console.log(data, 'inventory edit');
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}products/inventoryEdit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error with inventory edit'));
};
