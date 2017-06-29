/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import {
  userLoginRequest,
  saveUserSuccess
} from '../../../actions/loginActions';
import {
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR
} from '../../../constants/user';
import {
  successClient,
  failedClient
} from '../helpers/mockClients';
import {
  user,
  message,
  token
} from '../helpers/fixtures';

import localStorage from '../__mocks__/localStorage';

const mockFn = jest.fn();
jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

global.localStorage = localStorage;

let store;
const toastrSpy = jest.spyOn(toastr, 'success');

const setUpStore = (client) => {
  mockFn.mockReset();
  toastrSpy.mockReset();
  const middlewares = [thunk.withExtraArgument({
    client
  })];
  const mockStore = configureMockStore(middlewares);
  store = mockStore({
    user: {}
  });
};

describe('actions', () => {
  it('should create an action for a successful login', () => {
    const expectedAction = {
      type: SAVE_USER_SUCCESS,
      user
    };
    expect(saveUserSuccess(user)).toEqual(expectedAction);
  });
});

describe('login actions', () => {
  it('creates SAVE_USER_SUCCESS when login is successful', () => {
    const expectedActions = [{
      type: SAVE_USER_SUCCESS,
      user
    }];
    setUpStore(successClient);
    return store.dispatch(userLoginRequest()).then(() => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('/dashboard');
      expect(toastrSpy).toHaveBeenCalledWith(message);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('creates SAVE_USER_ERROR when login fails', () => {
    const expectedActions = [{
      type: SAVE_USER_ERROR,
      error: 'error'
    }];
    setUpStore(failedClient);

    return store.dispatch(userLoginRequest()).then(() => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('/');
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
