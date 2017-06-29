/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  ViewAllUsers
} from '../../../components/ViewAllUsers.jsx';


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

const user = {
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'Admin',
  email: 'ifiokabasi.eyo@andela.com'
};

const mockGetUser = jest.fn();


jest.mock('axios', () => (
  {
    interceptors: {
      request: {
        use: () => {}
      },
      response: {
        use: () => {}
      }
    },
    put: (url, param) => {
      return Promise.resolve();
    },
    get: (url, param) => {
      return Promise.resolve({
        data: {
          firstName: 'Ifiok',
          lastName: 'Eyo',
          username: 'Admin',
          email: 'ifiokabasi.eyo@andela.com'
        }
      });
    }
  }));


describe('<ViewAllUsers />', () => {

  beforeEach(() => {
    wrapper = mount(<ViewAllUsers
      getUser={mockGetUser}
    />);
  });

  afterEach(() => {
    mockFn.mockReset();
  });


  it('renders html elements with class names', () => {
    expect(wrapper.find('div').length).toBe(7);
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('.material-icons').length).toBe(1);
  });

  it('redirects to dashboard', () => {

    const backBtn = wrapper.find('.btn-flat');

    backBtn.simulate('click');
    expect(mockFn).toHaveBeenCalledWith('/dashboard');

  });

  it('calls client on componentWillMount', () => {
    expect(wrapper.state('users')).toMatchObject(user);
  });

  it('allows state to be set', () => {
    wrapper.setState({
      users: user
    });
    expect(wrapper.node.state.users).toEqual(user);
  });


});
