import { config } from '../siteDetails';
import axios from 'axios';


export const getCustomers = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}customers/get`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const addCustomer = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}customers/addCustomer`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding customer!'));
};

export const deleteCustomer = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}customers/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error deleting customer!'));
};

export const editCustomer = (data, id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}customers/edit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
