/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  CreateDocument
} from '../../../components/CreateDocument.jsx';

const mockFn = jest.fn();
const mockCreateDoc = jest.fn();

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

describe('<CreateDocument />', () => {
  beforeEach(() => {
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

  it('renders a div that contains an inner html', () => {
    expect(wrapper.find('.create-title').html())
      .toEqual("<div class=\"create-title center-align\">Create a New Document</div>");
  });

});
