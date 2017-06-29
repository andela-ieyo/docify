/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  EditDocument, mapStateToProps
} from '../../../components/EditDocument.jsx';
import client from '../../../utils/client';

const mockFn = jest.fn();

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
const mockSaveEditedDoc = jest.fn();

const document = {
  id: 1,
  title: 'Epitome of xcellence',
  content: 'Reality',
  ownerId: '1'
};

const user = {
  id: 1,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  username: 'sage',
  email: 'eyo@gmail.com',
  roleId: 1
};


// jest.mock('axios', () => (
//   {
//     interceptors: {
//       request: {
//         use: () => {}
//       },
//       response: {
//         use: () => {}
//       }
//     },
//     get: (url, param) => {
//       return Promise.resolve({ data: {
//         id: 1,
//         title: 'Epitome of xcellence',
//         content: 'Reality',
//         ownerId: '1'
//       } });
//     }
//   }));

client.get = jest.fn((url, param) =>
  Promise.resolve({
    data: {
      id: 1,
      title: 'Epitome of xcellence',
      content: 'Reality',
      ownerId: '1'
    }
  }));


describe('<EditDocument />', () => {

  beforeEach(() => {
    wrapper = mount(<EditDocument
      document={document}
      saveEditedDoc={mockSaveEditedDoc}
      user={user}
    />);
  });

  afterEach(() => {
    mockFn.mockReset();
  });


  it('renders html elements', () => {
    expect(wrapper.find('div').length).toBe(10);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('button').length).toBe(2);
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('select').length).toBe(1);
    expect(wrapper.find('option').length).toBe(4);
    expect(wrapper.find('.material-icons').length).toBe(1);
  });

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

  it('renders the required props on the input element', () => {
    const Input = wrapper.find('#title');
    expect(Input.node.value).toBe(document.title);
  });

  describe('calls client when document is empty', () => {
    beforeEach(() => {
      wrapper = mount(<EditDocument
        saveEditedDoc={mockSaveEditedDoc}
        user={user}
        id="1"
      />);
    });

    it('sets state to the response of the http call', () => {
      expect(wrapper.state('document')).toMatchObject(document);
    });
  });

  describe('mapStateToProps', () => {
    it('should return appropriate props', () => {
      const documents = {
        allDocuments: {
          count: 2,
          rows: [
            {
              id: 1,
              title: 'Lady Macbeth',
              access: 'Public',
              content: 'Reality and Fiction',
              ownerId: 1
            },
            {
              id: 2,
              title: 'Fool\'s Paradise',
              access: 'Public',
              content: 'Reality and Fiction',
              ownerId: 1
            }
          ]
        }
      };
      const { document: viewDoc, id } = mapStateToProps({ documents }, { params: { id: 1 } });
      expect(viewDoc).toMatchObject(documents.allDocuments.rows[0]);
      expect(id).toBe(1);
    });
  });
});
