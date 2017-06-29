/* global expect */

import configureMockStore from 'redux-mock-store';
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

const client = {
  get: (url, params) => Promise.resolve({
    data: {
      user
    }
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
  it('creates SAVE_DOCUMENT_SUCCESS when fetching documents has been done', () => {
    const expectedActions = [{
      type: types.SAVE_USER_SUCCESS,
      user: { user }
    }];
    const store = mockStore({ user:{} });
    return store.dispatch(actions.getUser(1)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

});
