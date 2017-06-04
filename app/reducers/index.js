import { combineReducers } from 'redux';
import user from './userReducer';
import flashMessages from './flashMessages';

const rootReducer = combineReducers({
  user,
  flashMessages
});

export default rootReducer;
