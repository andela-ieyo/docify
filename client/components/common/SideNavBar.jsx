import React, { Component } from 'react';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Roles } from '../../utils/roles';
import { logOut } from '../../actions/logOutAction';
import client from '../../utils/client';

/**
 *@desc set isActive class on clicked Nav Link.
 * @param {string} url
 * @returns {string} css - class
 */
const isActive = (url) => {
  return location.href.indexOf(url) > -1 ? 'selected' : '';
};

/**
 * @desc SideNaveBar component
 *
 * @class SideNavBar
 * @extends {Component}
 * @returns {jsx} jsx - returns jsx component
 */
export class SideNavBar extends Component {
  /**
   * Creates an instance of SideNavBar.
   * @param {any} props
   * @memberof SideNavBar
   */
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    };
    this.deleteAndLogout = this.deleteAndLogout.bind(this);
    this.showEmailConfirm = this.showEmailConfirm.bind(this);
    this.deleteMyAccount = this.deleteMyAccount.bind(this);
  }

  /**
   * @desc pops a modal that prompts the user to insert his email.
   * @param {string} email
   *
   * @memberof SideBar
   */
  showEmailConfirm(email) {
    return swal({
      title: 'Please, Confirm your account',
      text: 'Enter your email address:',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Enter email'
    }, (inputValue) => {
      if (inputValue === false) {
        return;
      }
      if (inputValue === '') {
        return swal.showInputError('You need to write something!');
      }
      if (inputValue !== email) {
        return swal('Info', 'You entered the wrong email', 'error');
      }
      return this.deleteAndLogout(email);
    });
  }

  /**
   * @desc calls the delete user account endpoint.
   * It requires the user's email as query.
   * @param {string} email
   *
   * @memberof SideNavBar
   */
  deleteAndLogout(email) {
    return client.delete(`/api/users/?email=${email}`)
      .then(res => {
        const successMsg = res.data.message;
        this.props.logOut();
        swal({
          title: 'Deleted!',
          text: successMsg,
          timer: 2000,
          type: 'success',
          showConfirmButton: false
        });

      }, error => {
        const errorMsg = error.response.data.message;
        swal({
          title: 'Oops, something went wrong!',
          text: errorMsg,
          timer: 2000,
          type: 'error',
          showConfirmButton: false
        });
      });
  }

   /**
   *
   * @desc pops a modal that propmts the user for a delete action.
   * Calls showEmailConfirm method on affirmation.
   * @param {any} email
   * @memberof SideNavBar
   */
  deleteMyAccount(email) {
    return swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, (response) => {
      if (response) {
        return this.showEmailConfirm(email);
      }
      return swal('Cancelled', 'Your account is safe :)', 'error');
    });
  }

  render() {
    const { user } = this.state;
    const Admin = user.roleId === Roles.Admin ? <span className="span-admin">Admin</span> : '';
    return (
      <div>
        <ul id="slide-out" className="side-nav">
          <li>
            <div className="userView">
              <span className="name">Welcome {user.lastName}</span>
              <span className="email">{user.email}</span>
              {Admin}
            </div>
          </li>

          <li><a
            className={`dashboard ${isActive('/dashboard')}`}
            id="dashboard"
            role="button"
            onClick={() =>
            browserHistory.push('/dashboard')
          }
          >Dashboard</a></li>

          <li><a
            className={`dashboard ${isActive('/create-document')}`}
            id="create-document"
            role="button"
            onClick={() =>
            browserHistory.push('/create-document')
          }
          >Create Document</a></li>


          <li className="public">
            <a
              className={`dashboard ${isActive('/document/public')}`}
              role="button"
              id="public"
              onClick={() =>
                browserHistory.push('/document/public')
              }
            >Public Documents</a></li>

          <li><a
            className={`dashboard ${isActive('/document/role')}`}
            role="button"
            id="role"
            onClick={() =>
            browserHistory.push('/document/role')
          }
          >Role Documents</a></li>

          <li><a
            className={`dashboard ${isActive('/document/private')}`}
            role="button"
            id="private"
            onClick={() =>
            browserHistory.push('/document/private')
          }
          >Private Documents</a></li>


          <li><a
            className="update-profile"
            role="button"
            onClick={() => {
              browserHistory.push(`/users/profile/edit/${user.id}`);
            }}
          >Update profile</a></li>

          { user.roleId !== Roles.Admin
          ? <li><a
            role="button"
            className="delete-profile"
            onClick={() => {
              this.deleteMyAccount(user.email);
            }}
          >Delete your account</a></li>
          : ''
        }

          { user.roleId === Roles.Admin
          ? <li id="view-all">
            <a
              role="button"
              className={`view-all-docify ${isActive('/users/all')}`}
              onClick={() => {
                browserHistory.push('/users/all');
              }}
            > View All Users</a>
          </li> : ''
        }
        </ul>
        <a data-activates="slide-out" className="button-collapse">
          <i className="Small material-icons docify-menu">menu</i>
        </a>
      </div>
    );
  }

}

SideNavBar.propTypes = {
  user: PropTypes.object.isRequired,
  logOut: PropTypes.func
};

export default connect(null, { logOut })(SideNavBar);
