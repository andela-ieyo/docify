/* global expect */

import jest from 'jest';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../../app/actions/documentActions';
import * as types from '../../../app/constants/documents';

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

const client = {
  get: (url, params) => Promise.resolve({
    data: {
      data
    }
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);

describe('searchDocument action', () => {
  it('dispatch a search result to store', () => {
    const expectedActions = [{
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: { data },
      category: 'searchDocuments'
    }];
    const store = mockStore({});
    return store.dispatch(actions.searchDocs('The')).then(() => {
      // return of async actions
      console.log(store.getActions());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
