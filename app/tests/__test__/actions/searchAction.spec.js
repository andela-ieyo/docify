/* global expect, jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import * as actions from '../../../../app/actions/documentActions';
import * as types from '../../../../app/constants/documents';

const data = [
  {
    title: 'The Lord of the Rings',
    access: 'public',
    content: 'Adventure'
  },
  {
    title: 'The Clutch',
    access: 'public',
    content: 'Adventure'
  }
];

let store;

const successClient = {
  get: (url, params) => Promise.resolve({
    data: {
      data
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

const setUpStore = (client) => {
  const middlewares = [thunk.withExtraArgument({
    client
  })];
  const mockStore = configureMockStore(middlewares);
  store = mockStore({
    user: {}
  });
};

const toastrSpy = jest.spyOn(toastr, 'error');


describe('searchDocument action', () => {
  it('dispatch a search result to store', () => {
    const expectedActions = [{
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: { data },
      category: 'searchDocuments'
    }];
    setUpStore(successClient);
    return store.dispatch(actions.searchDocs('The')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches an error message if error occurs', () => {
    setUpStore(failedClient);
    return store.dispatch(actions.searchDocs()).then(() => {
      expect(toastrSpy).toHaveBeenCalled();
    });
  });
});
