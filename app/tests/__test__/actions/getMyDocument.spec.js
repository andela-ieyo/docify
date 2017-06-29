/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import {
  retrieveMyDocuments,
  saveDocumentSuccess } from '../../../actions/documentActions';
import * as types from '../../../constants/documents';

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

const toastrSpy = jest.spyOn(toastr, 'info');

describe('actions', () => {
  it('should create an action to add a document', () => {
    const expectedAction = {
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: data,
      category: 'myDocuments'
    };
    expect(saveDocumentSuccess(data, 'myDocuments')).toEqual(expectedAction);
  });
});

describe('retrieveAllDocument action', () => {
  it('creates SAVE_DOCUMENT_SUCCESS after fetching all documents', () => {
    const expectedActions = [{
      type: types.SAVE_DOCUMENT_SUCCESS,
      documents: { data },
      category: 'myDocuments'
    }];
    const store = mockStore({ documents: {} });
    return store.dispatch(retrieveMyDocuments()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(toastrSpy).not.toHaveBeenCalled();
    });
  });
});
