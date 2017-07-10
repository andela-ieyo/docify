/* global expect, jest */


import {
  shallow, mount
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import {
  SideNavBar
} from '../../../../components/common/SideNavBar.jsx';
import client from '../../../../utils/client';

global.$ = $;
global.jQuery = $;

$.prototype.sideNav = () => {};
const mockRouter = jest.fn();
browserHistory.push = jest.fn((url) => {
  mockRouter(url);
});
const mockLogOut = jest.fn();
client.get = jest.fn((url, param) =>
  Promise.resolve());

jest.mock('sweetalert', () => {
  return (obj, fn) => {
    if (typeof obj === 'string') { return; }
    if (obj.type === 'warning' && fn) { return fn(true); }
    if (obj.type === 'input' && fn) { return fn('eyo@gmail.com'); }
  };
});

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

let wrapper;

describe('<SideNavBar />', () => {

  wrapper = shallow(<SideNavBar
    logOut={mockLogOut}
    user={user.currentUser}
  />);

  it('renders a <span> with the required props', () => {
    const header = wrapper.find('.name');
    expect(header.props().className).toEqual('name');
    expect(header.props().children[0]).toEqual('Welcome ');
    expect(header.props().children[1]).toEqual(user.currentUser.lastName);
  });

  it('renders a <span> with email as the required props', () => {
    const emailHolder = wrapper.find('.email');
    expect(emailHolder.props().className).toEqual('email');
    expect(emailHolder.props().children).toEqual(user.currentUser.email);
  });

  describe('handle click events', () => {

    wrapper = mount(<SideNavBar
      logOut={mockLogOut}
      user={user.currentUser}
    />);

    it('redirects to dashboard when dashboard nav link is clicked', () => {
      const dashboard = wrapper.find('#dashboard');
      dashboard.simulate('click');
      expect(mockRouter).toHaveBeenCalled();
      expect(mockRouter).toHaveBeenCalledWith('/dashboard');
    });

    it('redirects to create document page on click of the create document nav link', () => {
      const create = wrapper.find('#create-document');

      create.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/create-document');
    });

    it('redirects to public document page on click of the public document nav link', () => {
      const publicDoc = wrapper.find('#public');

      publicDoc.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/document/public');
    });

    it('redirects to role document page on click of the role document nav link', () => {
      const role = wrapper.find('#role');

      role.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/document/role');
    });

    it('redirects to private document page on click of the private document nav link', () => {
      const privateDoc = wrapper.find('#private');

      privateDoc.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/document/private');
    });

    it('redirects to update profile page on click of the update profile nav link', () => {
      const update = wrapper.find('.update-profile');

      update.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith(`/users/profile/edit/${user.currentUser.id}`);
    });
  });

  describe('', () => {
    beforeEach(() => {
      wrapper = mount(<SideNavBar
        logOut={mockLogOut}
        user={user.currentUser}
      />);
    });

    it('calls deleteMyAccount class method on click of the delete your account nav link', () => {
      const deleteLink = wrapper.find('.delete-profile');
      const emailConfirmSpy = jest.spyOn(wrapper.instance(), 'showEmailConfirm');
      const deleteAndLogoutSpy = jest.spyOn(wrapper.instance(), 'deleteAndLogout');
      deleteLink.simulate('click');
      expect(emailConfirmSpy).toHaveBeenCalled();
      expect(emailConfirmSpy).toHaveBeenCalledWith(user.currentUser.email);
      expect(deleteAndLogoutSpy).toHaveBeenCalled();
      expect(deleteAndLogoutSpy).toHaveBeenCalledWith(user.currentUser.email);
    });
  });
});
