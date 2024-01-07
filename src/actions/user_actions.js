import {
  SET_USER,
  SET_BREAKS,
  SET_EMP_BREAKS,
  SET_MY_BREAKS,
  SIGN_OUT,
} from '../types/app';
import { config } from '../siteDetails';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment-timezone';

export const setUser = (token) => {
  const decoded = jwt_decode(token);
  localStorage.setItem('email', decoded.user.email);

  decoded.token = token;
  return {
    type: SET_USER,
    payload: decoded,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const setBreaks = (data) => {
  return {
    type: SET_BREAKS,
    payload: data,
  };
};

export const checkExpiry = () => (dispatch) => {
  console.log('expiry check in hoc');

  if (localStorage.authToken) {
    const decoded = jwt_decode(localStorage.authToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken');
      this.props.history.push('/auth/login');
    } else {
      dispatch(setUser(localStorage.authToken));

    }
  } else {
    console.log('no token found');
    this.props.history.push('/auth/login');
  }
};
export const register = (name, email, password, role) => (dispatch) => {
  console.log(name, email, password, role, 'here');
  return new Promise((resolve, reject) => {
    return (
      axios({
        method: 'POST',
        url: `${config.serverUrl}user/add`,
        data: {
          email: email,
          password: password,
          role: role,
          name: name,
        },
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.authToken,
        },
      })
        .then((res) => {
          if (res.error) {
            resolve(res.error);
          } else {
            console.log(res, 'register response');
            resolve(true);
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        })
    );
  });
};
export const signInn = (email, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return axios({
      method: 'POST',
      url: `${config.serverUrl}login/logincheck`,
      data: {
        email: email,
        password: password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.data)
      .then((res) => {
        if (res.error) {
          resolve(res.error);
        } else {
          localStorage.setItem('authToken', res.token);

          dispatch(setUser(res.token));
          resolve(true);
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  });
};
const setEmpBreaks = (data) => {
  return {
    type: SET_EMP_BREAKS,
    payload: data,
  };
};
export const getEmployeeBreaks =
  (page = 1, limit = 10) =>
    (dispatch) => {
      return new Promise((resolve, reject) => {
        return axios({
          method: 'GET',
          url: `${config.serverUrl}break/getAll?page=${page}&limit=${limit}`,
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.authToken,
          },
        })
          .then((response) => response.data)
          .then((res) => {
            if (!res.data) {
              resolve(false);
            } else {
              dispatch(setEmpBreaks(res.data));
              resolve(true);
            }
          })
          .catch((err) => console.log(err, 'error fetching breaks'));
      });
    };
export const getBreaks = (id) => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}break/today/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error fetching breaks'));
};

export const getMyBreaks =
  (id, page = 1, limit = 10) =>
    (dispatch) => {
      return new Promise((resolve, reject) => {
        return axios({
          method: 'GET',
          url: `${config.serverUrl}break/getAll/${id}?page=${page}&limit=${limit}`,
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.authToken,
          },
        })
          .then((response) => response.data)
          .then((res) => {
            if (!res.data) {
              resolve(false);
            } else {
              dispatch(setMyBreaks(res.data));
              resolve(true);
            }
          })
          .catch((err) => console.log(err, 'error fetching breaks'));
      });
    };
const setMyBreaks = (data) => {
  return {
    type: SET_MY_BREAKS,
    payload: data,
  };
};

export const breakStart = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}break/start`,
    data: { user: id },
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error starting break'));
};

export const checkBreaks = (id) => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}break/check/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error checking breaks'));
};
export const breakEnd = (id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}break/end`,
    data: { user: id },
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error ending break'));
};
export const getEmployees = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}user/get`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const addEmployee = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}user/add`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const deleteEmployee = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}user/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const editEmployee = (data, id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}user/edit/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const getBreaksCount = (id) => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}break/getCount/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const getEmployeeBreaksCount = () => (dispatch) => {
  return axios({
    method: 'GET',
    url: `${config.serverUrl}break/getCount/`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};

export const getTimesheet = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}history/getAll`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error found fetching employees!'));
};
export const addReason = (data) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}history/reason`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding reason'));
};

export const editLeave = (data, id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}leave/update/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error editing leave'));
};
export const deleteLeave = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}leave/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error deleting leave'));
};

export const addLeave = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}leave/add`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};
export const adminAddLeave = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}leave/adminAdd`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding admin leave'));
};
export const approveLeave = (id) => (dispatch) => {
  return axios({
    method: 'PUT',
    url: `${config.serverUrl}leave/approve/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};
export const editLogs = (data, type) => (dispatch) => {
  data.selected_time = moment(data.selected_time).tz('GMT').format();
  let url = `${config.serverUrl}history/login`;
  if (type === 'logout') {
    url = `${config.serverUrl}history/logout`;
  }
  return axios({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};

export const editBreaks = (data, type) => (dispatch) => {
  console.log(type, 'type4');
  data.selected_time = moment(data.selected_time).tz('GMT').format();
  let url = `${config.serverUrl}break/editStart`;
  if (type === 'end') {
    url = `${config.serverUrl}break/editEnd`;
  }
  return axios({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};

export const fetchEvents = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}leave/getAllApproved`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};
export const fetchNews = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}news/getAll`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};
export const addNews = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}news/add`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};

export const deleteNews = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}news/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding leave'));
};
export const logEmployeeBreak = (data) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}break/startEnd`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: data,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error adding break'));
};
export const deleteEmployeeBreak = (id) => (dispatch) => {
  return axios({
    method: 'POST',
    url: `${config.serverUrl}break/remove`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.authToken,
    },
    data: { id },
  })
    .then((response) => response.data)
    .catch((err) => console.log(err, 'error deleting record'));
};
