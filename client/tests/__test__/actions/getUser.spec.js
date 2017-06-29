/* global expect, jest */

import configureMockStore from 'redux-mock-store';
import toastr from 'toastr';
import thunk from 'redux-thunk';
import * as actions from '../../../actions/getUser';
import * as types from '../../../constants/user';

const user = {
  id: 1,
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  roleId: 1
};

let store;

const successClient = {
  get: (url, params) => Promise.resolve({
    data: {
      user
    }
  })
};

const failedClient = {
  get() {
    return Promise.reject({
      response: {
        data: {
          message: 'error'
        }
      }
    });
  }
};

const toastrSpy = jest.spyOn(toastr, 'error');

const setUpStore = (client) => {
  const middlewares = [thunk.withExtraArgument({
    client
  })];
  const mockStore = configureMockStore(middlewares);
  store = mockStore({
    user: {}
  });
};


describe('async actions', () => {
  it('creates SAVE_DOCUMENT_SUCCESS when fetching documents has been done', () => {
    const expectedActions = [{
      type: types.SAVE_USER_SUCCESS,
      user: { user }
    }];
    setUpStore(successClient);
    return store.dispatch(actions.getUser(1)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches an error message if error occurs', () => {
    setUpStore(failedClient);
    return store.dispatch(actions.getUser()).then(() => {
      expect(toastrSpy).toHaveBeenCalled();
    });
  });

});
