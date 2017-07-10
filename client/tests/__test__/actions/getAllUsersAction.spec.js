/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getAllUsers } from '../../../actions/userActions';
import { LOAD_ALL_USERS } from '../../../constants/user';
import { users } from '../__mocks__/helpers/fixtures';


let store;

const Client = {
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
  it('dispatch LOAD_ALL_USERS to load all users into the store after fetching them ', () => {
    const expectedActions = [{
      type: LOAD_ALL_USERS,
      users,
      category: 'allUsers'

    }];

    setUpStore(Client);

    return store.dispatch(getAllUsers(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
