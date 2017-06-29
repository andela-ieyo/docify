/* global expect jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import {
  retrieveMyDocuments,
  saveDocumentSuccess } from '../../../actions/documentActions';
import * as types from '../../../constants/documents';


let store;

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
    documents: {}
  });
};


const toastrSpy = jest.spyOn(toastr, 'info');

const toastrErrorSpy = jest.spyOn(toastr, 'error');

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

    setUpStore(successClient);

    return store.dispatch(retrieveMyDocuments()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(toastrSpy).not.toHaveBeenCalled();
    });
  });

  it('dispatches an error message if error occurs', () => {
    setUpStore(failedClient);
    return store.dispatch(retrieveMyDocuments()).then(() => {
      expect(toastrErrorSpy).toHaveBeenCalled();
    });
  });
});
