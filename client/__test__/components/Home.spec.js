/* global expect */

import {
  mount
} from 'enzyme';
import React from 'react';
import Home from '../../components/Home.jsx';

let wrapper;

describe('<Home />', () => {
  wrapper = mount(<Home />);


  it('renders divs with class names', () => {
    expect(wrapper.find('.app-name').length).toBe(1);
    expect(wrapper.find('.docify-signup').length).toBe(1);
    expect(wrapper.find('.material-icons').length).toBe(2);
    expect(wrapper.find('.desc-middle').children().length).toBe(2);
    expect(wrapper.find('.desc-right').html())
      .toEqual("<div class=\"desc-right\"><div class=\"right-icon\"><span>Sign Up, It's Free</span></div><p>Sign up for a free account, Create your own group or Join one.</p></div>");
    expect(wrapper.find('.desc-left').length).toBe(1);


  });

});
