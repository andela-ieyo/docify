/* global expect */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveEditedDoc } from '../../../actions/documentActions';
import * as types from '../../../constants/documents';


const client = {
  put: (url, params) => Promise.resolve(
  { status: 200 }
  )
};

const documentDetails = {
  title: 'Ring that rules them all',
  access: 'public',
  content: 'Adventure'
};

const expectedActions = [{
  type: types.UPDATE_DOCUMENT,
  docId: 1,
  documentDetails,
  category: 'privateDocuments'
}];


const middlewares = [thunk.withExtraArgument({
  client
})];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  documents: {}
});

describe('saveEditedDoc action', () => {

  it('calls updateDocument action after a successful update ', () => {
    return store.dispatch(saveEditedDoc(1, documentDetails, 'private')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
