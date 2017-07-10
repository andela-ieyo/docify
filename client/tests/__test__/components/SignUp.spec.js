/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  SignUp
} from '../../../components/SignUp.jsx';
import { message, token } from '../__mocks__/helpers/fixtures';


let mockUserSignUpRequest;
const mockValidateLogin = jest.fn();

let wrapper;

describe('<SignUp />', () => {
  beforeEach(() => {
    mockUserSignUpRequest = jest.fn(() => {
      return Promise.resolve({
        message,
        token
      });
    });
    wrapper = mount(<SignUp
      userSignUpRequest={mockUserSignUpRequest}
      validateLogin={mockValidateLogin}
    />);

  });

  afterEach(() => {
    mockUserSignUpRequest.mockReset();
    mockValidateLogin.mockReset();
  });

  it('renders divs with class names', () => {
    expect(wrapper.find('#signup').length).toBe(1);
    expect(wrapper.find('div').length).toBe(18);
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('input').length).toBe(6);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('form').length).toBe(1);
  });

  it('simulates click events', () => {
    wrapper.setState({
      firstName: 'Ifiok',
      lastName: 'Eyo',
      username: 'Admin',
      email: 'ifiokabasi.eyo@andela.com',
      password: 'testing',
      pwConfirmation: 'testing',
      errors: {},
      isLoading: false
    });

    const saveBtn = wrapper.find('.signup-btn');
    jest.spyOn(wrapper.node, 'onClickSave');

    saveBtn.simulate('click');

    expect(mockUserSignUpRequest).toHaveBeenCalled();
    expect(mockUserSignUpRequest).toHaveBeenCalledWith({
      firstName: 'Ifiok',
      lastName: 'Eyo',
      username: 'Admin',
      email: 'ifiokabasi.eyo@andela.com',
      password: 'testing',
      pwConfirmation: 'testing',
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
