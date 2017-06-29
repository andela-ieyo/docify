/* global expect, jest */


import {
  mount
} from 'enzyme';
import $ from 'jquery';
import React from 'react';
import swal from 'sweetalert';
import {
  Dashboard
} from '../../../components/Dashboard.jsx';
import client from '../../../utils/client';


$.prototype.sideNav = () => {};
global.$ = $;
global.jQuery = $;

const mockRouter = jest.fn();

jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockRouter(url);
    }
  }
}));

jest.mock('sweetalert', () => {
  return (obj, fn) => {
    if (typeof obj === 'string') { return; }
    if (obj.type === 'warning' && fn) { return fn(true); }
    if (obj.type === 'input' && fn) { return fn('marve@andela.com'); }
  };
});


let wrapper;

const deleteSuccessMsg = 'Account deleted successfully';

const mockRetrieveMyDocuments = jest.fn();
const mockRetrieveAllDocuments = jest.fn();
const mockLogOut = jest.fn();
const mockSearchDocs = jest.fn();
const mockHandleCheckBoxChange = jest.fn();
const mockHandleOptionChange = jest.fn();

client.get = jest.fn((url, param) =>
  Promise.resolve({
    data: {
      id: 1,
      title: 'Epitome of xcellence',
      content: 'Reality',
      ownerId: '1'
    }
  }));

describe('<Dashboard />', () => {
  describe('renders html and simulate click events', () => {
    const document = {
      id: 1,
      title: 'Epitome of xcellence',
      content: 'Reality',
      ownerId: 1
    };

    const user = {
      id: 1,
      firstName: 'Ifiok',
      lastName: 'Eyo',
      email: 'eyo@andela.com',
      username: 'Admin',
      roleId: 3
    };

    beforeEach(() => {
      wrapper = mount(<Dashboard
        documents={document}
        user={user}
        roleId="3"
        retrieveMyDocuments={mockRetrieveMyDocuments}
        retrieveAllDocuments={mockRetrieveAllDocuments}
        logOut={mockLogOut}
        searchDocs={mockSearchDocs}
      />);
    });

    afterEach(() => {
      mockRouter.mockReset();
      mockLogOut.mockReset();
      mockSearchDocs.mockReset();
    });


    it('renders html elements', () => {
      expect(wrapper.find('div').length).toBe(12);
      expect(wrapper.find('p').length).toBe(1);
      expect(wrapper.find('button').length).toBe(1);
      expect(wrapper.find('input').length).toBe(4);
      expect(wrapper.find('span').length).toBe(3);
      expect(wrapper.find('a').length).toBe(4);
      expect(wrapper.find('ul').length).toBe(1);
      expect(wrapper.find('li').length).toBe(5);
    });

    it('redirects to /create-document', () => {
      const createBtn = wrapper.find('.docify-create-doc');

      createBtn.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/create-document');
    });

    it('redirects to /users/all', () => {
      const viewAllBtn = wrapper.find('.view-all-docify');

      viewAllBtn.simulate('click');
      expect(mockRouter).toHaveBeenCalledWith('/users/all');
    });

    it('redirects to /users/profile/edit', () => {
      const updateTab = wrapper.find('.update-profile');

      updateTab.simulate('click');

      expect(mockRouter).toHaveBeenCalledWith('/users/profile/edit/1');
    });

    it('sets state during search and calls searchDocs action', () => {
      const Input = wrapper.find('#search');

      Input.simulate('change', { target: {
        value: 'Epitome'
      } });
      expect(mockSearchDocs).toHaveBeenCalled();
      expect(mockSearchDocs).toHaveBeenCalledWith('Epitome', 0);
      expect(wrapper.state('isSearching')).toBe(true);
      expect(wrapper.state('query')).toBe('Epitome');
    });
  });

  describe('user confirms account deletion', () => {
    const document2 = {
      id: 2,
      title: 'Lady Macbeth',
      content: 'Adventure and Fiction',
      ownerId: 2
    };

    const user2 = {
      id: 2,
      firstName: 'Marve',
      lastName: 'Eyo',
      email: 'marve@andela.com',
      username: 'sage',
      roleId: 1
    };
    beforeEach(() => {
      client.delete = jest.fn((url, param) => {
          // return Promise.resolve({
          //   data: {
          //     message: deleteSuccessMsg
          //   }
          // });
        return {
          then: (successCb, failureCb) => {
            successCb({ data: { message: deleteSuccessMsg } });
          }
        };
      });

      wrapper = mount(<Dashboard
        documents={document2}
        user={user2}
        roleId="1"
        retrieveMyDocuments={mockRetrieveMyDocuments}
        retrieveAllDocuments={mockRetrieveAllDocuments}
        logOut={mockLogOut}
        searchDocs={mockSearchDocs}
      />);
    });

    it('calls client on deleteProfile and logs out the user', () => {
      const deleteProfileBtn = wrapper.find('.delete-profile');
      deleteProfileBtn.simulate('click');
      expect(mockLogOut).toHaveBeenCalled();
    });
  });

  // describe('user confirms account deletion', () => {
  //   const document2 = {
  //     id: 2,
  //     title: 'Lady Macbeth',
  //     content: 'Adventure and Fiction',
  //     ownerId: 2
  //   };

  //   const user2 = {
  //     id: 2,
  //     firstName: 'Marve',
  //     lastName: 'Eyo',
  //     email: 'marve@andela.com',
  //     username: 'sage',
  //     roleId: 1
  //   };

  //   beforeEach(() => {
  //     // jest.dontMock('sweetalert');


  //     wrapper = mount(<Dashboard
  //       documents={document2}
  //       user={user2}
  //       roleId="1"
  //       retrieveMyDocuments={mockRetrieveMyDocuments}
  //       retrieveAllDocuments={mockRetrieveAllDocuments}
  //       logOut={mockLogOut}
  //       searchDocs={mockSearchDocs}
  //     />);
  //   });


  //   it('calls client on deleteProfile and logs out the user', () => {
  //     const deleteProfileBtn = wrapper.find('.delete-profile');
  //     deleteProfileBtn.simulate('click');
  //     expect(mockLogOut).toHaveBeenCalled();
  //   });

  // });

  describe('renders presentational components', () => {
    it('renders the CheckBoxes component on mount', () => {
      expect(wrapper.find('CheckBoxes')).toBeDefined();
      expect(wrapper.find('CheckBoxes').length).toBe(1);
    });
  });

  describe('calls class methods', () => {
    it('set state when handleCheckBoxChange is called', () => {
      const mockEvent = {
        target: {
          value: 'private'
        }
      };

      wrapper.instance().handleCheckBoxChange(mockEvent);
      expect(wrapper.state('filters')).toMatchObject(['private']);
    });

    it('set state when handleOptionChange is called', () => {
      const mockView = {
        target: {
          value: 'myDocuments'
        }
      };

      wrapper.instance().handleOptionChange(mockView);
      expect(wrapper.state('view')).toBe(mockView.target.value);
    });
  });

});
