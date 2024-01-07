
import { config } from '../siteDetails';
import axios from 'axios';

export const getDeliveryDetails = (waybill) => (dispatch) => {
  let data = { "waybill": waybill };
  return axios({
    method: 'POST',
    url: `${config.serverUrl}order/getDeliveryStatus`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((res) => res.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const sendMail = (data, id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}order/sendMail/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken
    },
    data: data
  }).then((res) => res.data).catch((err) => console.log(err, 'error sending mail!'));
}
export const getOrders = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}orders/get`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const editStatus = (data, id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}order/editStatus/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error updating status!'));
};
export const addOrder = (data) => (dispatch) => {
  console.log(data, 'action data order');
  return axios({
    method: 'POST',
    url: `${config.serverUrl}order/addOrder`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found adding order!'));
};

export const deleteOrder = (id) => (dispatch) => {
  console.log(id, 'id order ');
  return axios({
    method: 'POST',
    url: `${config.serverUrl}order/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const editOrder = (data, id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}orders/edit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
