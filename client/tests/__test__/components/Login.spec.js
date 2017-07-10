/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  Login
} from '../../../components/Login.jsx';
import { message, token } from '../__mocks__/helpers/fixtures';


const mockUserLoginRequest =  jest.fn(() => {
  return Promise.resolve({
    message,
    token
  });
});

const mockValidateLogin = jest.fn();

let wrapper;

describe('<Login />', () => {
  beforeEach(() => {
    wrapper = mount(<Login
      userLoginRequest={mockUserLoginRequest}
      validateLogin={mockValidateLogin}
    />);

  });

  afterEach(() => {
    mockValidateLogin.mockReset();
  });

  it('renders divs with class names', () => {
    expect(wrapper.find('.login').length).toBe(1);
    expect(wrapper.find('div').length).toBe(11);
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('input').length).toBe(2);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('form').length).toBe(1);
  });

  it('calls userLoginRequest action when login form is submitted', () => {
    wrapper.setState({
      email: 'ifiokabasi.eyo@andela.com',
      password: 'testing',
      errors: {},
      isLoading: false
    });

    const saveBtn = wrapper.find('.docify-test');

    saveBtn.simulate('click');

    expect(mockUserLoginRequest).toHaveBeenCalled();
    expect(mockUserLoginRequest).toHaveBeenCalledWith({
      email: 'ifiokabasi.eyo@andela.com',
      password: 'testing',
      errors: {},
      isLoading: false
    });
  });

  it('sets state on input field change', () => {
    const mockEvent = {
      target: { id: 'email', value: 'goodness@andela.com' }
    };

    const Input = wrapper.find('#email');
    Input.simulate('change', mockEvent);

    expect(wrapper.state('email')).toEqual(mockEvent.target.value);
  });

});
