/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getCategoryDocuments,
  loadCategoryDocuments } from '../../actions/documentActions';
import * as types from '../../constants/documents';
import { publicDocuments } from '../__mocks__/helpers/fixtures';


let store;

const Client = {
  get: (url, params) => Promise.resolve({
    data: {
      publicDocuments
    }
  })
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


describe('actions', () => {
  it('should create an action to add documents based on category', () => {
    const expectedAction = {
      type: types.LOAD_CATEGORY_DOCUMENTS,
      documents: publicDocuments,
      category: 'publicDocuments'
    };
    expect(loadCategoryDocuments(publicDocuments, 'publicDocuments')).toEqual(expectedAction);
  });
});

describe('getCategoryDocuments action', () => {
  it('calls LOAD_CATEGORY_DOCUMENTS after fetching category documents', () => {
    const expectedActions = [{
      type: types.LOAD_CATEGORY_DOCUMENTS,
      documents: { publicDocuments },
      category: 'publicDocuments'
    }];

    setUpStore(Client);

    return store.dispatch(getCategoryDocuments(1, 'public')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

});
