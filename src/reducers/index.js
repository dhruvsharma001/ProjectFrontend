import { combineReducers } from 'redux';
import User from '../reducers/user_reducer';
const rootReducer = combineReducers({
  User,
});
export default rootReducer;
