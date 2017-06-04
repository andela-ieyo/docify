import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlashMessage from '../flash/FlashMessage.jsx';
import { deleteFlashMessage } from '../actions/flashMessages';
import { userSignUpRequest } from '../actions/signUpActions';
import validateInput from '../../server/shared/validations/signup';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      errors: {},
      isLoading: false
    };
    this.onClickSave = this.onClickSave.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    this.setState((state) => Object.assign({}, state, { [id]: value }));
  }

  onClickSave(event) {
    event.preventDefault();
    const { errors, isValid } = validateInput(this.state);

    if (isValid) {
      this.props.userSignUpRequest(this.state)
      .then(
        () => {
        /// redirect
        });
    }
    this.setState({ errors });
  }

  render() {
    const messages = this.props.flashMessages.map(message =>
       (<FlashMessage
         key={message.id}
         message={message}
         deleteFlashMessage={this.props.deleteFlashMessage}
       />)
    );

    const { errors } = this.state;
    const { firstName, lastName, username, email, password } = this.state;
    return (
      <div className="docify-home">
        <div>
          <button
            data-target="signup-modal"
            className="btn waves-effect waves-light"
            type="submit"
            name="action"
          >
              SignUp
              <i className="material-icons right">send</i>
          </button>
        </div>

        <div id="signup-modal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Sign Up</h4>
            </div>

            <div className="col s6 .right-align">
              {messages}
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
                      className="btn waves-effect waves-light"
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
  user: PropTypes.object,
  flashMessages: PropTypes.array,
  deleteFlashMessage: PropTypes.func.isRequired
};

const mapStateToProps = ({ user, flashMessages }) => ({ user, flashMessages });

export default connect(mapStateToProps, { userSignUpRequest, deleteFlashMessage })(SignUp);
