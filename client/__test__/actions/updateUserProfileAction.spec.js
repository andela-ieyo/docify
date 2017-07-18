/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { updateUserProfile } from '../../actions/userActions';
import { UPDATE_USER_SUCCESS } from '../../constants/user';


let store;

const user = {
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  email: 'moe.abraham@andela.com'
};

const Client = {
  put: (url, params) => Promise.resolve({
    status: 200
  })
};

const setUpStore = (client) => {
  const middlewares = [thunk.withExtraArgument({
    client
  })];
  const mockStore = configureMockStore(middlewares);
  store = mockStore({
    user: {}
  });
};


describe('updateProfile action', () => {
  it('dispatch UPDATE_USER_SUCCESS to update user record in the store', () => {
    const expectedActions = [{
      type: UPDATE_USER_SUCCESS,
      user
    }];
    setUpStore(Client);
    return store.dispatch(updateUserProfile(1, user)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
