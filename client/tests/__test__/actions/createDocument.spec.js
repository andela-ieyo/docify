/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  createDocument,
  addDocument
} from '../../../actions/documentActions';
import * as types from '../../../constants/documents';

const document =   {
  title: 'The Lord of the Rings',
  access: 'public',
  content: 'Adventure'
};

const client = {
  post: (url, params) => Promise.resolve({
    status: 200,
    data:{ document }
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {
  it('should create an action to add a document', () => {
    const expectedAction = {
      type: types.ADD_DOCUMENT,
      document,
      category: 'privateDocuments'
    };
    expect(addDocument(document, 'privateDocuments')).toEqual(expectedAction);
  });
});

describe('createDocument action', () => {
  it('dispatch ADD_DOCUMENT after creating a document successfully ', () => {
    const expectedActions = [{
      type: types.ADD_DOCUMENT,
      document,
      category: 'privateDocuments'
    }];
    const store = mockStore({
      documents: {}
    });
    return store.dispatch(createDocument()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
