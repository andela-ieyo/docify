/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import
  ViewAllUsersCard
 from '../../../components/ViewAllUsersCard.jsx';

let wrapper;

const mockUpdateRole = jest.fn();
const mockDeleteUser = jest.fn();

const user = {
  Role:{
    title: 'Admin'
  },
  id: 2,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'Admin',
  email: 'ifiokabasi.eyo@andela.com'
};

describe('<ViewAllUsersCard />', () => {

  beforeEach(() => {
    wrapper = mount(<ViewAllUsersCard
      user={user}
      updateRole={mockUpdateRole}
      deleteUser={mockDeleteUser}
    />);
  });

  afterEach(() => {
    mockDeleteUser.mockReset();
    mockUpdateRole.mockRestore();
  });


  it('renders divs with class names', () => {
    expect(wrapper.find('.docify-list').length).toBe(1);
    expect(wrapper.find('div').length).toBe(7);
    expect(wrapper.find('span').length).toBe(3);
    expect(wrapper.find('a').length).toBe(2);
    expect(wrapper.find('p').length).toBe(1);
  });

  it('simulates click events', () => {

    const backBtn = wrapper.find('.docify-update');
    const saveBtn = wrapper.find('.docify-delete');

    backBtn.simulate('click');
    saveBtn.simulate('click');
    expect(mockUpdateRole).toHaveBeenCalled();
    expect(mockUpdateRole).toHaveBeenCalledWith(user.id);
    expect(mockDeleteUser).toHaveBeenCalled();
    expect(mockDeleteUser).toHaveBeenCalledWith(user.id);
  });

});
