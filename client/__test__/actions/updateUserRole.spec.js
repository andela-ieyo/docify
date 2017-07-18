/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { updateUserRole } from '../../actions/userActions';
import { UPDATE_ROLE_SUCCESS } from '../../constants/user';


let store;

const user = {
  id: 1,
  firstName: 'Moe',
  lastName: 'Abraham',
  username: 'moe',
  email: 'moe.abraham@andela.com',
  Role: {
    id: 2,
    title: 'Editor'
  }
};

const newRole = {
  id: 1,
  title: 'Writer'
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
      type: UPDATE_ROLE_SUCCESS,
      id: user.id,
      newRole,
      category: 'allUsers'
    }];
    setUpStore(Client);
    return store.dispatch(updateUserRole(user.id, newRole)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
