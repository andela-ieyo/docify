import { combineReducers } from 'redux';
import user from './userReducer';
import documents from './documentReducer';

const rootReducer = combineReducers({
  user,
  documents
});

export default rootReducer;
