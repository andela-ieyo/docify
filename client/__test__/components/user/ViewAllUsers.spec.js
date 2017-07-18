/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import {
  ViewAllUsers, mapStateToProps
} from '../../../components/user/ViewAllUsers.jsx';
import { users, admin } from '../../__mocks__/helpers/fixtures';
import { SideNavBar } from '../../../components/common/SideNavBar.jsx';

global.$ = $;
global.jQuery = $;
$.prototype.sideNav = () => {};

let wrapper;

const mockGetAllUsers = jest.fn();

const mockUpdateUserRole = jest.fn(() => {
  return Promise.resolve({
    data: 'updated successfully'
  });
});
const mockDeleteUser = jest.fn();


describe('<ViewAllUsers />', () => {

  wrapper = mount(<ViewAllUsers
    getAllUsers={mockGetAllUsers}
    updateUserRole={mockUpdateUserRole}
    deleteUser={mockDeleteUser}
    users={users}
    user={admin}
  />);


  afterEach(() => {
    mockDeleteUser.mockReset();
  });

  it('calls client on componentDidMount', () => {
    expect(mockGetAllUsers).toHaveBeenCalled();
  });

  it('renders SideNavBar with the required props', () => {
    const navBar = wrapper.find(SideNavBar);
    expect(navBar.props()).toMatchObject({ user: admin });
  });

  it('renders page title with the intended text node', () => {
    const pageTitle = wrapper.find('.create-title');
    expect(pageTitle.props().className).toEqual('create-title center-align');
    expect(pageTitle.props().children).toEqual('All Users');
  });

  it('renders 4 table headers', () => {
    const tableHeader = wrapper.find('th');
    expect(tableHeader.length).toEqual(4);
  });

  it('calls handleChangeRole when update role button is clicked', () => {
    wrapper.instance().handleRoleChange(users.rows[0].id,
    { id: 2, title: 'Editor' });
    expect(mockUpdateUserRole).toHaveBeenCalled();
  });

  it('set state when searching', () => {
    const mockEvent = {
      target: {
        value: 'Moe Abraham'
      }
    };

    wrapper.instance().handleSearchInput(mockEvent);

    expect(wrapper.state('isSearching')).toBe(true);
    expect(wrapper.state('query')).toBe(mockEvent.target.value);
  });

  describe('mapStateToProps', () => {

    it('should receive the required props from mapStateToProps', () => {
      const { user: currentUser, allUsers }
      = mapStateToProps({ user: { currentUser: admin, allUsers: users } });

      expect(currentUser).toMatchObject(admin);
      expect(allUsers).toMatchObject(users);
    });
  });

});
