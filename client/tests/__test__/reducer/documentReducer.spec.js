/* global expect */

import reducer from '../../../../client/reducers/documentReducer';
import * as types from '../../../../client/constants/documents';


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

describe('document reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle SAVE_DOCUMENT_SUCCESS', () => {
    expect(
      reducer({}, {
        type: types.SAVE_DOCUMENT_SUCCESS,
        documents: data[0],
        category: 'allDocuments'
      })
    ).toEqual({ 'allDocuments': data[0] });
    expect(
      reducer(
        {
          'allDocuments': data[0]
        },
        {
          type: types.SAVE_DOCUMENT_SUCCESS,
          documents: data[1],
          category: 'myDocuments'
        }
      )
    ).toEqual(
      {
        'allDocuments': data[0],
        'myDocuments': data[1]
      },
    );
  });

});
