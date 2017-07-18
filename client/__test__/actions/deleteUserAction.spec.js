/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { deleteUser } from '../../actions/userActions';
import { LOAD_ALL_USERS } from '../../constants/user';
import { users } from '../__mocks__/helpers/fixtures';


let store;

const Client = {
  delete: (url, params) => Promise.resolve({}),
  get: (url, params) => Promise.resolve({
    data: users
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


describe('deleteUser action', () => {
  it('dispatch LOAD_ALL_USERS to update the store after a user is deleted', () => {
    const expectedActions = [{
      type: LOAD_ALL_USERS,
      users,
      category: 'allUsers'

    }];

    setUpStore(Client);

    return store.dispatch(deleteUser(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
