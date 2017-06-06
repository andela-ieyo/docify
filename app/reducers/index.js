import { combineReducers } from 'redux';
import user from './userReducer';
import documents from './documentReducer';
import flashMessages from './flashMessages';

const rootReducer = combineReducers({
  user,
  flashMessages,
  documents
});

export default rootReducer;
