/* global expect, jest */


import {
  shallow
} from 'enzyme';
import React from 'react';
import { browserHistory } from 'react-router';

import { document } from '../../__mocks__/helpers/fixtures';

import
  DocCard
 from '../../../components/document/common/DocCard.jsx';


let wrapper;

const mockDeleteDoc = jest.fn();

const mockRouter = jest.fn();
browserHistory.push = jest.fn((url) => {
  mockRouter(url);
});


const params = {
  category: 'privateDocuments'
};

const user = {
  id: 2,
  firstName: 'Mercy',
  lastName: 'Lenk',
  username: 'mercy',
  email: 'mercy.lenk@andela.com',
  roleId: 1
};

describe('<DocCard />', () => {
  wrapper = shallow(<DocCard
    doc={document}
    user={user}
    deleteDoc={mockDeleteDoc}
    category={params.category}
  />);

  afterEach(() => {
    mockDeleteDoc.mockReset();
  });


  it('renders a <span> containing the doc title as the required props', () => {
    const title = wrapper.find('.card-title');
    expect(title.props().className).toEqual('card-title');
    expect(title.props().children).toEqual(document.title);
    expect(title.length).toEqual(1);
  });

  it('renders a <p> containing the required props as doc content', () => {
    const content = wrapper.find('.docify-p');
    expect(content.props().className).toEqual('docify-p');
    expect(content.props().dangerouslySetInnerHTML.__html).toEqual(document.content);
    expect(content.length).toBe(1);
  });

  it('renders <div> with a <span> as child containing the required props', () => {
    const createdAt = wrapper.find('.card-action');
    expect(createdAt.props().children[0].type).toEqual('span');
    expect(createdAt.props().children[0].props.children).toEqual(document.createdAt);
  });

  it('renders <div> with active buttons as children with their required text node', () => {
    const button = wrapper.find('.docify-icons');
    expect(button.props().children[1].type).toEqual('button');
    expect(button.props().children[1].props.children).toEqual('Edit');
    expect(button.props().children[2].type).toEqual('button');
    expect(button.props().children[2].props.children).toEqual('Delete');
  });

  it('renders <div> with a <span> as child containing the required props as text node', () => {
    const access = wrapper.find('.docify-access-section');
    expect(access.props().children.type).toEqual('span');
    expect(access.props().children.props.children).toEqual(document.access);
  });

  it('renders <div> with a <span> as child containing the required props as text node', () => {
    const owner = wrapper.find('.docify-owner-section');
    expect(owner.props().children.type).toEqual('span');
    expect(owner.props().children.props.children[0]).toEqual(document.User.firstName);
    expect(owner.props().children.props.children[2]).toEqual(document.User.lastName);
  });

  it('redirects to /document/edit', () => {
    const editBtn = wrapper.find('#doc-edit');

    editBtn.simulate('click');
    expect(mockRouter).toHaveBeenCalledWith(`/document/edit/${params.category}/${document.id}`);
  });

  it('calls deleteDoc method when the delete button is clicked', () => {
    const deleteBtn = wrapper.find('#doc-delete');

    deleteBtn.simulate('click');
    expect(mockDeleteDoc).toHaveBeenCalledWith(document.id);
  });

});
