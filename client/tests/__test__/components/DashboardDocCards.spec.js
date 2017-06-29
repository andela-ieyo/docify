/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import
  DashboardDocCards
 from '../../../components/DashboardDocCards.jsx';

const mockFn = jest.fn();


jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

let wrapper;

const document = {
  User: {
    firstName: 'Ifiok',
    lastName: 'Eyo'
  },
  id: 1,
  title: 'Epitome of xcellence',
  content: 'Reality',
  access: 'public',
  ownerId: 1,
  createdAt: '2017-06-20 07:18:22.589+01'
};

const user = {
  id: 1,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  email: 'eyo@andela.com',
  username: 'Admin',
  roleId: 3

};


const mockDeleteDoc = jest.fn();

describe('<DashboardDocCards />', () => {
  beforeEach(() => {

    wrapper = mount(<DashboardDocCards
      user={user}
      doc={document}
      deleteDoc={mockDeleteDoc}
    />);
  });

  afterEach(() => {
    mockFn.mockReset();
    mockDeleteDoc.mockReset();
  });


  it('renders html elements', () => {
    expect(wrapper.find('div').length).toBe(7);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('button').length).toBe(2);
    expect(wrapper.find('span').length).toBe(4);
    expect(wrapper.find('a').length).toBe(1);
  });

  it('redirects to documents/view', () => {
    const viewBtn = wrapper.find('#doc-view');

    viewBtn.simulate('click');

    expect(mockFn).toHaveBeenCalledWith('documents/view/1');
  });

  it('calls deleteDoc method', () => {
    const deleteBtn = wrapper.find('#doc-delete');

    deleteBtn.simulate('click');
    expect(mockDeleteDoc).toHaveBeenCalled();
    expect(mockDeleteDoc).toHaveBeenCalledWith(document.id);
  });

  it('redirects to /documents/edit', () => {
    const editBtn = wrapper.find('#doc-edit');

    editBtn.simulate('click');

    expect(mockFn).toHaveBeenCalledWith('documents/edit/1');
  });
});
