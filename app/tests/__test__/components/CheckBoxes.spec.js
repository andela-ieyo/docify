/* global expect, jest */


import {
  mount
} from 'enzyme';
import React from 'react';
import
  CheckBoxes
 from '../../../components/CheckBoxes.jsx';


let wrapper;

// const document = {
//   id: 1,
//   title: 'Epitome of xcellence',
//   content: 'Reality',
//   ownerId: 1,
//   createdAt: '2017-06-20 07:18:22.589+01'
// };

const user = {
  id: 1,
  firstName: 'Ifiok',
  lastName: 'Eyo',
  email: 'eyo@andela.com',
  username: 'sage',
  roleId: 1

};


const mockHandleCheckBoxChange = jest.fn();
const mockHandleOptionChange = jest.fn();

describe('<CheckBoxes />', () => {
  beforeEach(() => {

    wrapper = mount(<CheckBoxes
      user={user}
      role="writer"
      view="allDocuments"
      handleCheckBoxChange={mockHandleCheckBoxChange}
      handleOptionChange={mockHandleOptionChange}
    />);
  });

  afterEach(() => {
    mockHandleCheckBoxChange.mockReset();
    mockHandleOptionChange.mockReset();
  });


  it('renders html elements', () => {
    expect(wrapper.find('div').length).toBe(4);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(3);
  });

  describe('simulates click events', () => {
    it('calls handleCheckBoxChange method', () => {
      const privateCheckBox = wrapper.find('#private');

      privateCheckBox.simulate('click');

      expect(mockHandleCheckBoxChange).toHaveBeenCalled();
    });

    it('calls handleOptionChange method', () => {
      const selectOption = wrapper.find('#docify-option');

      const mockEvent = {
        target: {
          value: 'myDocuments'
        }
      };

      selectOption.simulate('change', mockEvent);

      expect(mockHandleOptionChange).toHaveBeenCalled();
    });
  });
});
