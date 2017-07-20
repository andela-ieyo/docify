/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import localStorage from '../__mocks__/localStorage';
import { logOut, removeCurrentUser } from '../../actions/logOutAction';
import {
  REMOVE_CURRENT_USER
} from '../../constants/user';

const mockFn = jest.fn();
jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

const user = {
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  roleId: ''
};

global.localStorage = localStorage;

const toastrSpy = jest.spyOn(toastr, 'info');

const client = {
  get: (url, params) => Promise.resolve({
    data: {
      message: 'logout successful'
    }
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  it('should create an action for successful logout', () => {
    const expectedAction = {
      type: REMOVE_CURRENT_USER,
      user
    };
    expect(removeCurrentUser(user, 'currentUser')).toEqual(expectedAction);
  });
});


describe('logout action', () => {
  it('log out a user successful and clears the token from local storage', () => {
    const store = mockStore({ user:{} });

    return store.dispatch(logOut()).then(() => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('/');
      expect(toastrSpy).toHaveBeenCalledWith('logout successful');
    });
  });

  it('dispatches REMOVE_CURRENT_USER action and removes the user from the store', () => {
    const expectedActions = [{
      type: REMOVE_CURRENT_USER,
      user
    }];

    const store = mockStore({ user:{} });

    return store.dispatch(logOut()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
