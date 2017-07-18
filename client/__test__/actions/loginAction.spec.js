/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  userLoginRequest,
  saveUser
} from '../../actions/loginActions';
import {
  SAVE_USER
} from '../../constants/user';
import {
  successClient
} from '../__mocks__/helpers/mockClients';
import {
  user
} from '../__mocks__/helpers/fixtures';

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
  it('should create an action for a successful login', () => {
    const expectedAction = {
      type: SAVE_USER,
      user,
      category: 'currentUser'
    };
    expect(saveUser(user, 'currentUser')).toEqual(expectedAction);
  });
});

describe('login actions', () => {
  it('dispatch SAVE_USER when login is successful', () => {
    const expectedActions = [{
      type: SAVE_USER,
      user,
      category: 'currentUser'
    }];
    setUpStore(successClient);
    return store.dispatch(userLoginRequest()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
