import {
  SAVE_USER,
  LOAD_ALL_USERS,
  UPDATE_ROLE_SUCCESS,
  UPDATE_USER_SUCCESS,
  REMOVE_CURRENT_USER } from '../constants/user';

export default function userReducer(state = {}, action) {
  switch (action.type) {

    case SAVE_USER: {
      const { category, user } = action;
      return { ...state, [category]: user };
    }

    case LOAD_ALL_USERS: {
      const { category, users } = action;
      return { ...state, [category]: users };
    }

    case UPDATE_ROLE_SUCCESS: {
      const { id, newRole, category } = action;
      const { [category] : { rows = [] } = {} }  = state;
      const targetUser = rows.find((user) => user.id === id);
      const remainingUsers = rows.filter((user) => user.id !== id);
      const updatedUser = { ...targetUser, Role: newRole };
      const updatedUserList = remainingUsers.concat(updatedUser);
      return { ...state, [category]: { count: updatedUserList.length, rows: updatedUserList } };
    }

    case UPDATE_USER_SUCCESS:
    case REMOVE_CURRENT_USER: {
      const { user } = action;
      const updatedCurrentUser = { ...state.currentUser, ...user };
      return { ...state, currentUser: updatedCurrentUser };
    }

    default:
      return state;
  }
}
