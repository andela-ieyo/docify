/* global expect, jest */


import {
  shallow
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import AllUsersList
 from '../../../components/user/AllUsersList.jsx';
import { users } from '../../__mocks__/helpers/fixtures';

global.$ = $;
global.jQuery = $;

$.prototype.modal = () => {};

let wrapper;

const mockHandleRoleChange = jest.fn();
const mockDeleteUser = jest.fn();

describe('<AllUsersList />', () => {

  wrapper = shallow(<AllUsersList
    user={users.rows[0]}
    handleRoleChange={mockHandleRoleChange}
    deleteUser={mockDeleteUser}
  />);

  afterEach(() => {
    mockDeleteUser.mockReset();
    mockHandleRoleChange.mockReset();
  });

  it('sets state to the value from the input field', () => {

    const input = wrapper.find('#role-select');

    const mockEvent = {
      target: {
        value: '2'
      }
    };

    input.simulate('change', mockEvent);
    expect(wrapper.state('Role').id).toEqual(parseInt(mockEvent.target.value, 10));
  });

  it('renders 4 <td> with the required props as text node', () => {

    const tableData = wrapper.find('td');

    expect(tableData.length).toEqual(4);
    expect(tableData.nodes[0].type).toEqual('td');
    expect(tableData.nodes[0].props.children[0]).toEqual(users.rows[0].firstName);
    expect(tableData.nodes[0].props.children[2]).toEqual(users.rows[0].lastName);
    expect(tableData.nodes[1].type).toEqual('td');
    expect(tableData.nodes[1].props.children).toEqual(users.rows[0].email);
    expect(tableData.nodes[2].type).toEqual('td');
    expect(tableData.nodes[2].props.children).toEqual(users.rows[0].Role.title);
    expect(tableData.nodes[3].type).toEqual('td');
    expect(tableData.nodes[3].props.children[1].type).toEqual('a');
    expect(tableData.nodes[3].props.children[1].props.children).toEqual('Delete User');
  });

  it('calls deleteUser method when the delete user button is clicked', () => {

    const deleteBtn = wrapper.find('.docify-delete');

    deleteBtn.simulate('click');

    expect(mockDeleteUser).toHaveBeenCalled();
  });

  it('calls handleRoleChange method when the submit button is clicked', () => {

    const submitBtn = wrapper.find('#submit');

    submitBtn.simulate('click', { preventDefault() {} });

    expect(mockHandleRoleChange).toHaveBeenCalled();
  });


});
