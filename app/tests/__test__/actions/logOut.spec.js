/**
 * @jest-environment jsdom
 */

/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import localStorage from '../__mocks__/localStorage';
import logOut from '../../../actions/logOutAction';

const mockFn = jest.fn();
jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

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


describe('logout action', () => {
  it('log out a user successful and clears the token from local storage', () => {
    const store = mockStore({ user:{} });
    return store.dispatch(logOut()).then(() => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('/');
      expect(toastrSpy).toHaveBeenCalledWith('logout successful');
    });
  });
});
