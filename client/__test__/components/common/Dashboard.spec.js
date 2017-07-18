/* global expect, jest */


import {
  mount
} from 'enzyme';
import $ from 'jquery';
import React from 'react';
import { browserHistory } from 'react-router';
import {
  Dashboard
} from '../../../components/common/Dashboard.jsx';
import
  DashboardCard
 from '../../../components/common/DashboardCard.jsx';
import { SideNavBar } from '../../../components/common/SideNavBar.jsx';
import { documents, users } from '../../__mocks__/helpers/fixtures';


global.$ = $;
global.jQuery = $;
$.prototype.sideNav = () => {};

const mockRouter = jest.fn();
browserHistory.push = jest.fn((url) => {
  mockRouter(url);
});

let wrapper;

const mockGetCategoryDocuments = jest.fn();
const mockGetAllUsers = jest.fn();

const user = {
  currentUser: {
    id: 1,
    firstName: 'Ifiok',
    lastName: 'Eyo',
    username: 'sage',
    email: 'eyo@gmail.com',
    roleId: 1
  }
};

describe('<Dashboard />', () => {

  afterEach(() => {
    mockRouter.mockReset();
  });

  wrapper = mount(<Dashboard
    documents={documents}
    user={user.currentUser}
    getCategoryDocuments={mockGetCategoryDocuments}
    getAllUsers={mockGetAllUsers}
    allusers={users}
  />);


  describe('Simulate click event', () => {

    it('redirects to CREATE DOCUMENT page when the create document button is clicked', () => {
      const createBtn = wrapper.find('.docify-create-doc');

      createBtn.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/create-document');
    });
  });


  describe('renders required props', () => {

    it('renders a SIDE-NAVBAR with the required props', () => {
      const sideNav = wrapper.find(SideNavBar);

      expect(sideNav.props()).toMatchObject({ user: user.currentUser });
      expect(sideNav.length).toBe(1);
    });

    it('renders a <div> with the required props as page title', () => {
      const title = wrapper.find('.dashboard-welcome-msg');

      expect(title.props().children[0]).toEqual('Welcome back ');
      expect(title.props().children[1]).toEqual(user.currentUser.lastName);
    });

    it('renders 3 DASHBOARD-CARDS with the required props', () => {
      const card = wrapper.find(DashboardCard);


      expect(card.length).toEqual(3);
      expect(card.nodes[0].props.details).toEqual(`${documents.privateDocuments.count} Document(s)`);
      expect(card.nodes[0].props).toMatchObject({
        title: 'Private',
        details: '2 Document(s)',
        icon: 'folder',
        link: 'document/private' });
      expect(card.nodes[1].props.details).toEqual(`${documents.publicDocuments.count} Document(s)`);
      expect(card.nodes[1].props).toMatchObject({
        title: 'Public',
        details: '2 Document(s)',
        icon: 'folder',
        link: 'document/public' });
      expect(card.nodes[2].props.title).toEqual('Role');
    });
  });

  describe('dispatch async actions on mount', () => {
    it('calls getCategoryDocuments action', () => {
      wrapper = mount(<Dashboard
        documents={documents}
        user={user.currentUser}
        getCategoryDocuments={mockGetCategoryDocuments}
        getAllUsers={mockGetAllUsers}
        allusers={users}
      />);

      expect(mockGetCategoryDocuments).toHaveBeenCalled();
      expect(mockGetAllUsers).not.toHaveBeenCalled();
    });
  });

});
