/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import {
  UpdateProfile, mapStateToProps
} from '../../../../components/user/UpdateProfile.jsx';
import { SideNavBar } from '../../../../components/common/SideNavBar.jsx';


const mockRouter = jest.fn();
browserHistory.push = jest.fn((url) => {
  mockRouter(url);
});

global.$ = $;
global.jQuery = $;
$.prototype.sideNav = () => {};

let wrapper;
let onChangeBtn;


const user = {
  id: '1',
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'Admin',
  email: 'ifiokabasi.eyo@andela.com'
};
const newUsername = 'sage';
const successMessage = 'update successfilly';
const params = {
  id: '1'
};


const mockUpdateUserProfile = jest.fn(() => {
  return Promise.resolve({
    data: {
      successMessage
    }
  });
});


describe('<UpdateProfile />', () => {
  wrapper = mount(<UpdateProfile
    user={user}
    id={params.id}
    updateUserProfile={mockUpdateUserProfile}
  />);

  afterEach(() => {
    mockRouter.mockReset();
  });


  it('should redirect to dashbaord', () => {

    const backBtn = wrapper.find('.btn-flat');
    backBtn.simulate('click');

    expect(mockRouter).toHaveBeenCalledWith('/dashboard');
  });

  describe('renders required props', () => {
    it('should render SideNavBar with the required props', () => {
      const sideNav = wrapper.find(SideNavBar);
      expect(sideNav.props()).toMatchObject({ user });
    });

    it('should render the page title with the required props', () => {
      const title = wrapper.find('.create-title');

      expect(title.props().className).toEqual('create-title center-align');
      expect(title.props().children).toEqual('Edit your Profile');
    });

    it('should render the firstName received as props in the input field', () => {
      const firstNameField = wrapper.find('#firstName');
      expect(firstNameField.props().value).toEqual(user.firstName);
    });

    it('should render the lastName received as props in the input field', () => {
      const lastNameField = wrapper.find('#lastName');
      expect(lastNameField.props().value).toEqual(user.lastName);
    });

    it('should render the email received as props in the input field', () => {
      const emailField = wrapper.find('#email');
      expect(emailField.props().value).toEqual(user.email);
    });

    it('should render the username received as props in the input field', () => {
      const usernameField = wrapper.find('#username');
      expect(usernameField.props().value).toEqual(user.username);
    });
  });

  describe('On update of user profile', () => {

    it('sets state to the value of the input field', () => {

      onChangeBtn = wrapper.find('#username');
      onChangeBtn.simulate('change', { target: { id: 'username', value: newUsername } });

      expect(wrapper.state('user').username).toEqual(newUsername);

    });

    it('dispatch updateUserProfile action when form is submitted', () => {


      const submitBtn = wrapper.find('.btn-update');
      submitBtn.simulate('click');

      expect(mockUpdateUserProfile).toHaveBeenCalled();
    });
  });

  describe('mapStateToProps', () => {
    it('should return appropriate props', () => {
      const storeUser = {
        currentUser: {
          id: 2,
          firstName: 'John',
          lastName: 'Enroe',
          username: 'sage',
          email: 'john.enroe@andela.com'
        }
      };
      const { id, user: currentUser }
      = mapStateToProps({ user: storeUser }, { params: { id: 2 } });
      expect(currentUser).toMatchObject(storeUser.currentUser);
      expect(id).toBe(2);
    });
  });
});
