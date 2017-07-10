/* global expect, jest */


import {
  shallow, mount
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import {
  EditDocument, mapStateToProps
} from '../../../../components/document/EditDocument.jsx';
import client from '../../../../utils/client';
import { documents } from '../../__mocks__/helpers/fixtures';

const mockFn = jest.fn();
global.$ = $;
global.jQuery = $;

$.prototype.sideNav = () => {};

global.CKEDITOR = {
  replace: () => {},
  instances:{
    content: {
      getData: () => {}
    }
  }
};

jest.mock('react-router', () => ({
  browserHistory: {
    push(url) {
      mockFn(url);
    }
  }
}));

let wrapper;
const mockSaveEditedDoc = jest.fn(() => {
  return Promise.resolve({
    message: 'update successful'
  });
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

const category = 'privateDocuments';

client.get = jest.fn((url, param) =>
  Promise.resolve());


describe('<EditDocument />', () => {

  wrapper = shallow(<EditDocument
    document={documents.privateDocuments.rows[0]}
    saveEditedDoc={mockSaveEditedDoc}
    user={user.currentUser}
    category={category}
  />);

  it('renders the required props for the title Input element', () => {
    const title = wrapper.find('#title');
    expect(title.props().value).toEqual(documents.privateDocuments.rows[0].title);
  });

  it('renders the required props for the access Input element', () => {
    const title = wrapper.find('#access');
    expect(title.props().value).toEqual(documents.privateDocuments.rows[0].access);
  });

  it('renders the required props for the content Input element', () => {
    const title = wrapper.find('#content');
    expect(title.props().value).toEqual(documents.privateDocuments.rows[0].content);
  });


  describe('handle click events', () => {

    wrapper = mount(<EditDocument
      document={documents.privateDocuments.rows[0]}
      saveEditedDoc={mockSaveEditedDoc}
      user={user.currentUser}
      category={category}
    />);

    it('calls saveEditedDoc action creator', () => {
      const saveBtn = wrapper.find('.docify-save-edit');

      saveBtn.simulate('click');

      expect(mockSaveEditedDoc).toHaveBeenCalled();
    });

    it('redirects to dashbaord', () => {
      const backBtn = wrapper.find('.btn-flat');

      backBtn.simulate('click');

      expect(mockFn).toHaveBeenCalledWith('/dashboard');
    });

    it('changes the title to the value of the form input element', () => {
      const Input = wrapper.find('#title');

      const mockEvent = {
        target: {
          id: 'title',
          value: 'My new value'
        }
      };

      Input.simulate('change', mockEvent);

      expect(wrapper.state('document').title).toBe(mockEvent.target.value);
    });
  });

  describe('mapStateToProps', () => {
    wrapper = mount(<EditDocument
      document={documents.privateDocuments.rows[0]}
      saveEditedDoc={mockSaveEditedDoc}
      user={user.currentUser}
      category={category}
    />);

    it('should receive the required props from mapStateToProps', () => {
      const { document, id, category, user: currentUser }
      = mapStateToProps({
        documents,
        user
      },
        {
          params: {
            id: 1,
            category: 'privateDocuments'
          }
        });
      expect(document).toMatchObject(documents.privateDocuments.rows[0]);
      expect(id).toBe(1);
      expect(category).toBe('privateDocuments');
      expect(currentUser).toBe(user.currentUser);
    });
  });
});
