import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { userLoginRequest } from '../actions/loginActions';
import validateLogin from '../../server/shared/validations/login';


/**
 *
 *
 * @desc represnts Login Page.
 * @class Login
 * @extends {Component}
 */
export class Login extends Component {
  /**
   * Creates an instance of Login.
   * @param {object} props
   *
   * @memberof Login
   */
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

  /**
   *
   * @desc handles onChange event on the form input.
   * @param {object} event
   *
   * @memberof Login
   * @returns {void}
   */
  onFieldChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    this.setState((state) => Object.assign({}, state, { [id]: value }));
  }

    /**
   *
   * @desc handles submit action on the form.
   *  calls userLoginRequest action.
   * @param {object} event
   *
   * @memberof Login
   * @returns {void}
   */
  onClickSave(event) {
    event.preventDefault();
    const { errors, isValid } = validateLogin(this.state);

    if (isValid) {
      this.props.userLoginRequest(this.state)
       .then((res) => {
         const { message, token } = res.data;
         toastr.success(message);
         window.localStorage.setItem('jwtToken_docify', token);
         browserHistory.push('/dashboard');
       })
       .catch((error) => {
         const errorMsg = error.response.data.message;
         toastr.error(errorMsg);
       });
    }
    this.setState({ errors });
  }

  render() {

    const { errors } = this.state;
    const { email, password } = this.state;
    return (
      <div className="docify-login">
        <div className="login">
          <div>
            <div className="login-title">
              <h4>Login</h4>
            </div>

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
                      name="submit"
                      className="btn waves-effect waves-light docify-test"
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
