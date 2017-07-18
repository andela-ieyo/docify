/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  deleteDocument,
  deleteDocumentSuccess
} from '../../../actions/documentActions';
import * as types from '../../../constants/documents';

const document =   {
  id: 1,
  title: 'The Lord of the Rings',
  access: 'public',
  content: 'Adventure'
};
const client = {
  delete: (url, params) => Promise.resolve({
    status: 200
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {
  it('should create an action to delete a document', () => {
    const expectedAction = {
      type: types.DELETE_DOCUMENT_SUCCESS,
      docId: document.id,
      category: 'privateDocuments'
    };
    expect(deleteDocumentSuccess(document.id, 'privateDocuments')).toEqual(expectedAction);
  });
});

describe('deleteDocument action', () => {
  it('dispatch DELETE_DOCUMENT_SUCCESS after deleting a document successfully ', () => {
    const expectedActions = [{
      type: types.DELETE_DOCUMENT_SUCCESS,
      docId: document.id,
      category: 'privateDocuments'
    }];
    const store = mockStore({
      documents: {}
    });
    return store.dispatch(deleteDocument(document.id, 'private')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
