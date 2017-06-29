import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userSignUpRequest } from '../actions/signUpActions';
import validateInput from '../../server/shared/validations/signup';

/**
 *
 *
 * @desc represents sSignup page.
 * @class SignUp
 * @extends {Component}
 */
export class SignUp extends Component {
  /**
   * Creates an instance of SignUp.
   * @param {object} props
   *
   * @memberof SignUp
   */
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      pwConfirmation: '',
      errors: {},
      isLoading: false
    };
    this.onClickSave = this.onClickSave.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  /**
   *
   * @desc handles onChange event in the form input.
   * @param {object} event
   *
   * @memberof SignUp
   */
  onFieldChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    this.setState((state) => Object.assign({}, state, { [id]: value }));
  }

  /**
   *
   * @desc handles submit action from form.
   *  Calls userSignUpRequest action.
   * @param {object} event
   *
   * @memberof SignUp
   * returns {void}
   */
  onClickSave(event) {
    event.preventDefault();
    const { errors, isValid } = validateInput(this.state);

    if (isValid) {
      this.props.userSignUpRequest(this.state);
    }
    this.setState({ errors });
  }

  render() {
    const { errors } = this.state;
    const { firstName, lastName, username, email, password, pwConfirmation } = this.state;
    return (
      <div className="docify-signup">


        <div id="signup">
          <div>
            <div className="signup-title">
              <h4>Sign Up</h4>
            </div>

            <div className="row">
              <form className="col s12" action="">
                <div className="row">
                  <div className="input-field col s6">
                    <i className="material-icons prefix">account_circle</i>
                    <input
                      id="firstName"
                      type="text"
                      className="validate"
                      onChange={this.onFieldChange}
                      value={firstName}
                    />
                    <label htmlFor="first_name">First Name</label>
                    {errors.firstName && <span className="validate">{errors.firstName}</span>}
                  </div>

                  <div className="input-field col s6">
                    <input
                      id="lastName"
                      type="text"
                      className="validate"
                      value={lastName}
                      onChange={this.onFieldChange}
                    />
                    <label htmlFor="last_name">Last Name</label>
                    {errors.lastName && <span className="validate">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="username"
                      type="text"
                      className="validate"
                      onChange={this.onFieldChange}
                      value={username}
                    />
                    <label htmlFor="disabled">Username</label>
                    {errors.username && <span className="validate">{errors.username}</span>}
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="password"
                      type="password"
                      className="validate"
                      value={password}
                      onChange={this.onFieldChange}
                    />
                    <label htmlFor="password">Password</label>
                    {errors.password && <span className="validate">{errors.password}</span>}
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="pwConfirmation"
                      type="password"
                      className="validate"
                      value={pwConfirmation}
                      onChange={this.onFieldChange}
                    />
                    <label htmlFor="password"> Confirm Password</label>
                    {errors.pwConfirmation && <span className="validate">{errors.pwConfirmation}</span>}
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="email"
                      type="email"
                      className="validate"
                      value={email}
                      onChange={this.onFieldChange}
                    />
                    <label htmlFor="email">Email</label>
                    {errors.email && <span className="validate">{errors.email}</span>}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12 s6">
                    <button
                      className="btn waves-effect waves-light signup-btn"
                      onClick={this.onClickSave}
                      disabled={this.state.isLoading}
                    >
                    Submit
                    <i className="material-icons right">send</i>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

SignUp.propTypes = {
  userSignUpRequest: PropTypes.func.isRequired,
  user: PropTypes.object
};

SignUp.defaultProps = {
  user: {}
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps, { userSignUpRequest })(SignUp);
