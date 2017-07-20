/* global expect, jest */


import {
  mount, shallow
} from 'enzyme';
import React from 'react';
import $ from 'jquery';
import {
  CreateDocument
} from '../../../components/document/CreateDocument.jsx';
import {
  SideNavBar
} from '../../../components/common/SideNavBar.jsx';

const mockFn = jest.fn();
let mockCreateDoc;

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

const user = {
  id: 1,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'sage',
  email: 'eyo@gmail.com',
  roleId: 1
};

const message = 'document created successfully';

describe('<CreateDocument />', () => {
  describe('On mount handle click events', () => {
    beforeEach(() => {
      mockCreateDoc = jest.fn(() => {
        return Promise.resolve({
          data: {
            message
          }
        });
      });

      wrapper = mount(<CreateDocument
        createDocument={mockCreateDoc}
        user={user}
      />);

    });

    afterEach(() => {
      mockFn.mockReset();
      mockCreateDoc.mockReset();
    });

    it('renders html elements', () => {
      expect(wrapper.find('.create-title').length).toBe(1);
      expect(wrapper.find('.docify-back').length).toBe(1);
      expect(wrapper.find('.docify-create').length).toBe(1);
      expect(wrapper.find('[htmlFor="title"]').length).toBe(1);
      expect(wrapper.find('[htmlFor="content"]').length).toBe(1);
      expect(wrapper.find('#access').length).toBe(1);
      expect(wrapper.find('option').length).toBe(4);

    });

    it('redirects to dashboard', () => {

      const Button = wrapper.find('.btn-flat');

      Button.simulate('click');

      expect(mockFn).toHaveBeenCalledWith('/dashboard');
    });

    it('calls createDocument action creator', () => {
      wrapper.setState({
        title: 'The widow',
        access: 'private',
        content: 'Emotional',
        errors: { error: null }
      });

      const saveBtn = wrapper.find('.docify-save');
      jest.spyOn(wrapper.node, 'saveDoc');

      saveBtn.simulate('click');

      expect(mockCreateDoc).toHaveBeenCalled();
      expect(mockCreateDoc).toHaveBeenCalledWith({
        title: 'The widow',
        access: 'private',
        content: 'Emotional',
        errors: { error: null }
      });
    });

    it('changes the title of the document on form input change', () => {
      wrapper.setState({
        title: 'The widow',
        access: 'private',
        content: 'Emotional',
        errors: { error: null }
      });

      const Input = wrapper.find('#title');

      const mockEvent = {
        target: {
          id: 'title',
          value: 'My new value'
        }
      };


      Input.simulate('change', mockEvent);

      expect(wrapper.state('title')).toBe(mockEvent.target.value);
    });
  });

  describe('render Props', () => {
    mockCreateDoc = jest.fn(() => {
      return Promise.resolve({
        data: {
          message
        }
      });
    });

    wrapper = shallow(<CreateDocument
      createDocument={mockCreateDoc}
      user={user}
    />);

    it('should render header inner HTML', () => {
      const header = wrapper.find('.create-title');

      expect(header.props().children).toEqual('Create a New Document');
    });

    it('should render the required props to child component', () => {

      const navBar = wrapper.find(SideNavBar);
      expect(navBar.props()).toMatchObject({ user });
    });
  });


});
