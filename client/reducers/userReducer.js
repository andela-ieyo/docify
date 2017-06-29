import { SAVE_USER_SUCCESS, SAVE_USER_ERROR, SAVE_USER } from '../constants/user';

export default function userReducer(state = { isLoading: false }, action) {
  switch (action.type) {
    case SAVE_USER:
      return { ...state, isLoading: true, error: null };

    case SAVE_USER_SUCCESS:
      return { isLoading: false, ...action.user };

    case SAVE_USER_ERROR:
      return { ...state, isLoading: false, error: action.error };

    default:
      return state;
  }
}
