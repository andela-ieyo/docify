/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import {
  Document, mapStateToProps
} from '../../../../components/document/Document.jsx';
import { documents, storeUser } from '../../__mocks__/helpers/fixtures';
import {
  SideNavBar
} from '../../../../components/common/SideNavBar.jsx';
import
  SearchBar
 from '../../../../components/layout/SearchBar.jsx';
import
  DocCard
 from '../../../../components/document/common/DocCard.jsx';


global.$ = $;
global.jQuery = $;
$.prototype.sideNav = () => {};

const mockFn = jest.fn();

global.CKEDITOR = {
  replace: () => {}
};

jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

let wrapper;

const mockGetCategoryDocuments = jest.fn();
const mockDeleteDocument = jest.fn();

const params = {
  category: 'private'
};

describe('<Document />', () => {
  wrapper = mount(<Document
    document={documents}
    user={storeUser}
    categoryDocuments={documents.privateDocuments}
    getCategoryDocuments={mockGetCategoryDocuments}
    deleteDocument={mockDeleteDocument}
    params={params}
  />);

  afterEach(() => {
    mockFn.mockReset();
    mockGetCategoryDocuments.mockReset();
  });


  it('renders a SideNavBar with the required props', () => {
    const sideNav = wrapper.find(SideNavBar);
    expect(sideNav.props()).toMatchObject({ user: storeUser });
  });

  it('renders a search bar', () => {
    const searchBar = wrapper.find(SearchBar);
    expect(searchBar.length).toBe(1);
  });

  it('renders 2 DocCards with the required props', () => {
    const card = wrapper.find(DocCard);

    expect(card.length).toBe(documents.privateDocuments.rows.length);
    expect(card.nodes[0].props.doc).toMatchObject(documents.privateDocuments.rows[0]);
    expect(card.nodes[0].props.user).toMatchObject(storeUser);
    expect(card.nodes[1].props.doc).toMatchObject(documents.privateDocuments.rows[1]);
    expect(card.nodes[1].props.user).toMatchObject(storeUser);
  });

  describe('mapStateToProps', () => {

    it('should receive the required props from mapStateToProps', () => {
      const { user: currentUser, categoryDocuments }
      = mapStateToProps({
        documents,
        user: storeUser
      },
        {
          params
        });
      expect(categoryDocuments).toBe(documents.privateDocuments);
      expect(currentUser).toBe(storeUser.currentUser);
    });
  });

});
