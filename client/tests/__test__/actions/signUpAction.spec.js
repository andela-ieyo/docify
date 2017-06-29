/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import {
  userSignUpRequest,
  saveUserSuccess
} from '../../../actions/signUpActions';
import {
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR
} from '../../../constants/user';

import localStorage from '../__mocks__/localStorage';

export const user = {
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  email: 'moe.abraham@andela.com',
  password: 'testing'
};

export const message = 'SignUp successful';
export const token = 'WRGVVH567878';


export const successClient = {
  post() {
    return Promise.resolve({
      data: {
        message,
        token,
        user
      }
    });
  }
};

export const failedClient = {
  post() {
    return Promise.reject({
      response: {
        data: {
          message: 'error'
        }
      }
    });
  }
};

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
  it('should create an action for a successful signup', () => {
    const expectedAction = {
      type: SAVE_USER_SUCCESS,
      user
    };
    expect(saveUserSuccess(user)).toEqual(expectedAction);
  });
});

describe('signUp actions', () => {
  it('creates SAVE_USER_SUCCESS when login is successful', () => {
    const expectedActions = [{
      type: SAVE_USER_SUCCESS,
      user
    }];
    setUpStore(successClient);
    return store.dispatch(userSignUpRequest()).then(() => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('/dashboard');
      expect(toastrSpy).toHaveBeenCalledWith(message);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('creates SAVE_USER_ERROR when login fails', () => {
    const spy = jest.spyOn(toastr, 'error');
    const expectedActions = [{
      type: SAVE_USER_ERROR,
      error: 'error'
    }];
    setUpStore(failedClient);

    return store.dispatch(userSignUpRequest()).then(() => {
      expect(spy).toHaveBeenCalledWith('error');
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
