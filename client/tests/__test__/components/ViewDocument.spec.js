/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import {
  ViewDocument,
  mapStateToProps
} from '../../../components/ViewDocument.jsx';

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

const document = {
  id: 1,
  title: 'Epitome of xcellence',
  content: 'Reality',
  ownerId: '1'
};


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
    get: (url, param) => {
      return Promise.resolve({ data: {
        id: 1,
        title: 'Epitome of xcellence',
        content: 'Reality',
        ownerId: '1'
      } });
    }
  }));

describe('<ViewDocument />', () => {

  beforeEach(() => {
    wrapper = mount(<ViewDocument
      document={document}
      id="1"
    />);
  });

  afterEach(() => {
    mockFn.mockReset();
  });


  it('renders html elements', () => {
    expect(wrapper.find('div').length).toBe(5);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('redirects to dashboard click', () => {
    const backBtn = wrapper.find('.btn-flat');

    backBtn.simulate('click');
    expect(mockFn).toHaveBeenCalledWith('/dashboard');

  });

  describe('calls client when document is empty on mount', () => {
    beforeEach(() => {
      wrapper = mount(<ViewDocument
        id="1"
      />);
    });


    it('sets state to the response of the http call', () => {
      expect(wrapper.state('doc')).toMatchObject(document);
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
