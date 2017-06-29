/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import toastr from 'toastr';
import {
  UpdateProfile, mapStateToProps
} from '../../../components/UpdateProfile.jsx';
import client from '../../../utils/client';

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
let toastrSpySuccess;
let toastrSpyFail;

const user = {
  id: '1',
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'Admin',
  email: 'ifiokabasi.eyo@andela.com'
};
const newUsername = 'sage';
const errorMessage = 'Server error';

client.get = jest.fn((url) => {
  if (url.indexOf(user.id) > -1) { return Promise.resolve({ data: user }); }
  return Promise.reject({ response: { data: { message: errorMessage } } });
});

client.put = jest.fn((url, param) =>
  Promise.resolve({ data: { ...user, username: newUsername } }));


describe('<UpdateProfile />', () => {
  describe('if user already already exists', () => {
    beforeEach(() => {
      wrapper = mount(<UpdateProfile user={user} id="1" />);
    });

    afterEach(() => {
      mockFn.mockReset();
    });


    it('renders divs with class names', () => {
      expect(wrapper.find('.create-title').length).toBe(1);
      expect(wrapper.find('div').length).toBe(16);
      expect(wrapper.find('input').length).toBe(5);
      expect(wrapper.find('button').length).toBe(2);
      expect(wrapper.find('form').length).toBe(1);
      expect(wrapper.find('.material-icons').length).toBe(2);
    });

    it('should redirect to dashbaord', () => {
      const backBtn = wrapper.find('.btn-flat');
      backBtn.simulate('click');
      expect(mockFn).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('if user does not exist and id is valid', () => {
    beforeEach(() => {
      wrapper = mount(<UpdateProfile id="1" />);
    });

    it('should load user data if available', () => {
      expect(wrapper.state('user')).toMatchObject(user);
    });
  });

  describe('if user does not exist and id is valid', () => {
    beforeEach(() => {
      wrapper = mount(<UpdateProfile id="2" />);
      toastrSpyFail = jest.spyOn(toastr, 'error');
    });

    afterEach(() => {
      toastrSpyFail.mockReset();
    });

    it('should show error message if user is wrong', () => {
      expect(wrapper.state('user')).toMatchObject({});
      expect(toastrSpyFail).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('On update of user profile', () => {

    wrapper = mount(<UpdateProfile user={user} id="1" />);
    let onChangeBtn;


    toastrSpySuccess = jest.spyOn(toastr, 'success');

    beforeEach(() => {
      onChangeBtn = wrapper.find('#username');
      onChangeBtn.simulate('change', { target: { id: 'username', value: newUsername } });
    });


    afterEach(() => {
      toastrSpySuccess.mockReset();
    });

    const submitBtn = wrapper.find('.btn-update');

    submitBtn.simulate('click');

    it('should show success message on successful update', () => {
      expect(toastrSpySuccess).toHaveBeenCalled();
    });

    it('should set state with data from form input', () => {
      expect(wrapper.state('user').username).toBe(newUsername);
    });
  });

  describe('mapStateToProps', () => {
    it('should return appropriate props', () => {
      const storeUser = {
        id: 2,
        firstName: 'John',
        lastName: 'Enroe',
        username: 'sage',
        email: 'john.enroe@andela.com'
      };
      const { user: viewUser, id } = mapStateToProps({ user: storeUser }, { params: { id: 2 } });
      expect(viewUser).toMatchObject(storeUser);
      expect(id).toBe(2);
    });
  });
});
