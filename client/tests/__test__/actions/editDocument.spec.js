/* global expect, jest */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import { saveEditedDoc } from '../../../actions/documentActions';
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
  put: (url, params) => Promise.resolve({
    data: {
      message: 'update successful'
    }
  }),

  get: (url, params) => Promise.resolve({
    data: {
      data
    }
  })
};

const expectedActions = [{
  type: types.SAVE_DOCUMENT_SUCCESS,
  documents:  { data },
  category: 'allDocuments'
}];


const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  documents: {}
});

let toastrSpy;

beforeEach(() => {
  toastrSpy = jest.spyOn(toastr, 'success');
});

afterEach(() => {
  toastrSpy.mockReset();
});

describe('saveEditedDoc action', () => {

  it('calls retrieveAllDocuments action after a successful update ', () => {
    return store.dispatch(saveEditedDoc()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('call toastr with a success message', () => {
    return store.dispatch(saveEditedDoc()).then(() => {
      expect(toastrSpy).toHaveBeenCalled();
      expect(toastrSpy).toHaveBeenCalledWith('update successful');
    });

  });
});
