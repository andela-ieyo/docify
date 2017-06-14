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
      rows: data,
      count: data.length
    }
  })
};

const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {
  it('should create an action to add a document', () => {
    const expectedAction = {
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: data[0],
      category: 'myDocuments'
    };
    expect(actions.saveDocumentSuccess(data[0], 'myDocuments')).toEqual(expectedAction);
  });
});

describe('async actions', () => {
  it('creates SAVE_DOCUMENT_SUCCESS when fetching documents has been done', () => {
    const expectedActions = [{
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: data,
      category: 'allDocuments'
    }];
    const store = mockStore({
      documents: {}
    });
    return store.dispatch(actions.retrieveAllDocuments()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
