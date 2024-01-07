import {
  SIGN_IN,
  SIGN_OUT,
  SET_USER,
  SET_BREAKS,
  // SET_EMP_BREAKS,
  // SET_MY_BREAKS,
} from '../types/app';

export default function (
  state = {
    token: '',
    user: {},
    auth: {
      message: 'invalid',
    },
  },
  action
) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        token: action.payload.token || null,
        user: action.user,
        auth: {
          message: 'valid',
        },
      };
    // case SET_MY_BREAKS:
    //   return {
    //     ...state,
    //     employeeData: action.payload,
    //   };
    // case SET_EMP_BREAKS:
    //   return {
    //     ...state,
    //     employeesData: action.payload,
    //   };
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
        auth: {
          message: 'valid',
        },
        token: action.payload.token
      };
    case SET_BREAKS:
      // console.log(action.payload.data);
      return {
        ...state,
        breaks: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        auth: {
          message: 'invalid',
        },
        token: null,
        user: {},
      };
    default:
      return state;
  }
}
