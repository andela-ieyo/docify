import { SAVE_DOCUMENT_SUCCESS } from '../constants/documents';

export default function documentReducer(state = {}, action) {
  switch (action.type) {
    case SAVE_DOCUMENT_SUCCESS: {
      const { category, documents } = action;
      return { ...state, [category]: documents };
    }
    default:
      return state;
  }
}
