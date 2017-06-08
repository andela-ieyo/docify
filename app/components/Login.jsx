import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { userLoginRequest } from '../actions/loginActions';
import validateLogin from '../../server/shared/validations/login';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { errors, isValid } = validateLogin(this.state);

    if (isValid) {
      this.props.userLoginRequest(this.state)
      .then(
        () => {
          browserHistory.push('/dashboard');
        });
    }
    this.setState({ errors });
  }

  render() {
    /*const messages = this.props.flashMessages.map(message =>
       (<FlashMessage
         key={message.id}
         message={message}
         deleteFlashMessage={this.props.deleteFlashMessage}
       />)
    );*/

    const { errors } = this.state;
    const { email, password } = this.state;
    return (
      <div className="docify-home">
        <div className="login">
          <div>
            <div>
              <h4>Login</h4>
            </div>

            {/*<div className="col s6 .right-align">
              {messages}
            </div>*/}

            <div className="row">
              <form className="col s12" action="">

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

Login.propTypes = {
  userLoginRequest: PropTypes.func.isRequired,
  user: PropTypes.object
};

Login.defaultProps = {
  user: {}
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps, { userLoginRequest })(Login);
