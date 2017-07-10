/* global $ */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { Row, Input } from 'react-materialize';
import Back from '../common/Back.jsx';
import { SideNavBar } from '../common/SideNavBar.jsx';
import { updateUserProfile } from '../../actions/userActions';

/**
 *
 *
 * @desc reprsents the Update user Profile Page.
 * @class UpdateProfile
 * @extends {Component}
 */
export class UpdateProfile extends Component {
  /**
   * Creates an instance of UpdateProfile.
   * @param {object} props
   *
   * @memberof UpdateProfile
   */
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      isToggleOff: '1'
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  componentDidMount() {
    $('label').addClass('active');
    $('.button-collapse').sideNav({ 'closeOnClick': true });
  }

  /**
   * @desc handles form input field change.
   * @param {object} event
   *
   * @memberof UpdateProfile
   * @returns {void}
   */
  handleFieldChange(event) {
    const { id, value } = event.target;
    const field = id;
    this.setState({ user: { ...this.state.user, [field]: value } });
  }

  /**
   * @desc handles toggle change.
   * @param {object} event
   *
   * @memberof UpdateProfile
   * @returns {void}
   */
  handleToggleChange() {
    this.setState(prevState => ({
      isToggleOff: !prevState.isToggleOff
    }));
  }

  /**
   * @desc handles submit action of form.
   *  Calls update user Profile endpoint.
   * @param {object} event
   *
   * @memberof UpdateProfile
   * @returns {void}
   */
  submitHandler(event) {
    event.preventDefault();
    const userId = this.props.id;
    const fieldData = { ...this.state.user };
    this.props.updateUserProfile(userId, fieldData)
      .then(res => {
        const successMsg = res.data.message;
        toastr.success(successMsg);
      })
      .catch(error => {
        const errorMsg = error.response.data.message;
        toastr.error(errorMsg);
      });
  }

  render() {
    const { user, isToggleOff } = this.state;


    return (
      <div>
        <div className="row">
          <SideNavBar
            user={this.props.user}
          />
          <div className="create-title center-align">
          Edit your Profile
          </div>
          <Back />
        </div>

        <div className="row container-fluid docify-create center-align">
          <form className="col s12 update-form">
            <div className="row">
              <div className="input-field col s6">
                <i className="material-icons prefix">account_circle</i>
                <input
                  id="firstName"
                  type="text"
                  className="validate"
                  onChange={this.handleFieldChange}
                  value={user.firstName || ''}
                />
                <label htmlFor="firstName">First Name</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s6">
                <input
                  id="lastName"
                  type="text"
                  className="validate"
                  value={user.lastName || ''}
                  onChange={this.handleFieldChange}
                />
                <label htmlFor="lastname">Last Name</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s6">
                <input
                  id="username"
                  type="text"
                  className="validate"
                  onChange={this.handleFieldChange}
                  value={user.username || ''}
                />
                <label htmlFor="username">Username</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s6">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  value={user.email || ''}
                  onChange={this.handleFieldChange}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <Row>
              <Input
                name="on"
                onClick={this.handleToggleChange}
                type="switch"
                value={isToggleOff ? '0' : '1'}
              />
              <label htmlFor="on">Toggle to change password</label>
            </Row>

            <div className="row">
              <div
                className="input-field col s6"
              >

                {!isToggleOff ? <input
                  id="password"
                  type="password"
                  className="validate"
                  placeholder="password"
                  value={user.password || ''}
                  onChange={this.handleFieldChange}
                /> : ''
              }
              </div>
            </div>


            <div className="row">
              <div className="input-field col s12 s6">
                <button
                  className="btn waves-effect waves-light btn-update"
                  type="submit"
                  name="action"
                  onClick={this.submitHandler}
                >Save
                 <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

UpdateProfile.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string.isRequired,
  updateUserProfile: PropTypes.func.isRequired
};


export const mapStateToProps = ({ user }, { params }) => {
  const { currentUser = {} } = user;
  const { id } = params;
  return {
    id,
    user: currentUser
  };
};

export default connect(mapStateToProps, { updateUserProfile })(UpdateProfile);
