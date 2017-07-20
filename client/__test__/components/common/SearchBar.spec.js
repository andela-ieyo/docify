/* global expect, jest */


import { mount } from 'enzyme';
import React from 'react';
import SearchBar from '../../../components/layout/SearchBar.jsx';


let wrapper;

const mockHandleSearchInput = jest.fn();

describe('<SearchBar> component', () => {
  wrapper = mount(<SearchBar
    query=""
    handleSearchInput={mockHandleSearchInput}
  />);

  it('calls handleSearchInput method when searching', () => {
    const input = wrapper.find('#search');

    const mockEvent = {
      target: {
        value: 'lord'
      }
    };

    input.simulate('change', mockEvent);

    expect(mockHandleSearchInput).toHaveBeenCalled();
  });

  it('renders html elements as expected', () => {
    expect(wrapper.find('div').length).toBe(3);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('i').length).toBe(1);
    expect(wrapper.find('i').props().children).toBe('search');
  });

});
