/* global expect */

import reducer from '../../../client/reducers/documentReducer';
import * as types from '../../../client/constants/documents';
import {
  document,
  privateDocuments,
  publicDocuments } from '../__mocks__/helpers/fixtures';


describe('document reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle ADD_DOCUMENT action and save document to store', () => {
    expect(
      reducer({}, {
        type: types.ADD_DOCUMENT,
        document,
        category: 'privateDocuments'
      })
    ).toEqual({ 'privateDocuments': { count: 1, rows: [document] } });
  });

  it('should handle DELETE_DOCUMENT_SUCCESS action and remove document from store', () => {
    expect(
      reducer({
        privateDocuments
      }, {
        type: types.DELETE_DOCUMENT_SUCCESS,
        category: 'privateDocuments',
        docId: 1
      })
    ).toEqual({ 'privateDocuments': { count: 1, rows: [privateDocuments.rows[1]] } });
  });

  it('should handle UPDATE_DOCUMENT action and update document in the store', () => {
    const documentDetails = {
      title: 'Ring that rules them all',
      access: 'private',
      content: 'Adventure'
    };

    expect(
      reducer({
        privateDocuments
      }, {
        type: types.UPDATE_DOCUMENT,
        documentDetails,
        docId: 1,
        category: 'privateDocuments'
      })
    ).toEqual({ 'privateDocuments': {
      count: 2,
      rows: [
        {
          id: 2,
          title: 'The Clutch',
          access: 'private',
          content: 'Adventure',
          User: {
            id: 2,
            firstName: 'Jed',
            lastName: 'Lee'
          }
        },
        {
          id: 1,
          title: 'Ring that rules them all',
          access: 'private',
          content: 'Adventure',
          User: {
            id: 2,
            firstName: 'Jed',
            lastName: 'Lee'
          }
        }
      ]
    }
    });
  });

  it('should LOAD PRIVATE documents into the store using their CATEGORY', () => {
    expect(
      reducer({}, {
        type: types.LOAD_CATEGORY_DOCUMENTS,
        category: 'privateDocuments',
        documents: privateDocuments
      })
    ).toEqual({ privateDocuments });
  });

  it('should LOAD PUBLIC documents into the store using their CATEGORY', () => {
    expect(
      reducer({}, {
        type: types.LOAD_CATEGORY_DOCUMENTS,
        category: 'publicDocuments',
        documents: publicDocuments
      })
    ).toEqual({ publicDocuments });
  });

});
