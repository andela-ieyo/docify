/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  userSignUpRequest,
  saveUser
} from '../../../actions/signUpActions';
import {
  SAVE_USER
} from '../../../constants/user';


const user = {
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  email: 'moe.abraham@andela.com',
  password: 'testing'
};


const successClient = {
  post() {
    return Promise.resolve({
      data: {
        user
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


let store;

const setUpStore = (client) => {
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
      type: SAVE_USER,
      user,
      category: 'currentUser'
    };
    expect(saveUser(user, 'currentUser')).toEqual(expectedAction);
  });
});

describe('signUp actions', () => {
  it('dispatch SAVE_USER when login is successful', () => {
    const expectedActions = [{
      type: SAVE_USER,
      user,
      category: 'currentUser'
    }];
    setUpStore(successClient);

    return store.dispatch(userSignUpRequest()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
