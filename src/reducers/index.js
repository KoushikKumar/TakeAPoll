import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import pollsReducer from './polls_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  auth:authReducer,
  polls:pollsReducer,
  user:userReducer
});

export default rootReducer;
