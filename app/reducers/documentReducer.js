import { SAVE_USER_DOCUMENT_SUCCESS } from '../constants/documents';

export default function documentReducer(state = [], action) {
  switch (action.type) {
    case SAVE_USER_DOCUMENT_SUCCESS:
      return [...state, ...action.documents];

    default:
      return state;
  }
}
