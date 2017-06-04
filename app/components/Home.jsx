import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';
import { userSignUpRequest } from '../actions/signUpActions';
import { addFlashMessage } from '../actions/flashMessages';
import SignUp from './SignUp.jsx';

injectTapEventPlugin();


class Home extends Component {
  render() {
    // const { userSignUpRequest, addFlashMessage } = this.props;
    return (
      <div>
        <SignUp />
      </div>
    );
  }
}

// Home.propTypes = {
//   userSignUpRequest: PropTypes.func.isRequired,
//   addFlashMessage: PropTypes.func.isRequired
// };


export default Home;
