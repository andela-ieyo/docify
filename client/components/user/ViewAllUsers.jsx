/* global $ */

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import toastr from 'toastr';
import client from '../../utils/client';
import AllUsersList from './AllUsersList.jsx';
import Back from '../common/Back.jsx';
import { SideNavBar } from '../common/SideNavBar.jsx';
import SearchBar from '../layout/SearchBar.jsx';
import Pagination from '../common/Pagination.jsx';
import {
  getAllUsers,
  updateUserRole,
  deleteUser } from '../../actions/userActions';

/**
 * @desc represents the ViewAllUsers container Component.
 *
 * @class ViewAllUsers
 * @extends {Component}
 */
export class ViewAllUsers extends Component {
  /**
   * Creates an instance of ViewAllUsers.
   * @param {object} props
   *
   * @memberof ViewAllUsers
   */
  constructor(props) {
    super(props);
    this.state = {
      allUsers: props.allUsers || {},
      searchResult: [],
      query: '',
      isSearching: false,
      selectedPage: 0
    };
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  componentDidMount() {
    $('.button-collapse').sideNav({ 'closeOnClick': true });
    this.props.getAllUsers(this.state.selectedPage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allUsers) {
      this.setState({
        allUsers: nextProps.allUsers
      });
    }
  }

  /**
   * @desc sets a new page displaying users.
   * @param {number} page
   *
   * @memberof ViewAllUsers
   * @returns {array} returns an array of user objects
   */
  setPage(page) {
    if (this.state.selectedPage !== page) {
      this.setState({ selectedPage: page });
      if (this.state.isSearching) {
        client.get(`/api/search/users/?name=${this.state.query}&page=${page}&limit=6`)
          .then(res => {
            this.setState({ searchResult: res.data });
          }, error => {
            toastr.error(error.response.data.message);
          });
      }
      client.get(`/api/users/?page=${page}&limit=6`)
        .then(res => {
          this.setState({ allUsers: res.data });
        }, error => {
          toastr.error(error.response.data.message);
        });
    }
  }


  /**
   * @param {string} event
   *
   * @memberof ViewAllUsers
   * @returns {array} returns an array of user objects matching the search query
   */
  handleSearchInput(event) {
    const { value } = event.target;
    this.setState({ isSearching: value.length > 0, query: value });
    client.get(`/api/search/users/?name=${this.state.query}&page=${this.state.selectedPage}&limit=6`)
      .then(res => {
        this.setState({ searchResult: res.data });
      }, error => {
        toastr.error(error.response.data.message);
      });

  }


  /**
   * @desc this method calls the update a user's role endpoint, using the userId as params.
   * @param {number} userId
   *
   * @memberof ViewAllUsers
   * @returns {string} returns a success message or error message
   */
  handleRoleChange(userId, newRole) {
    this.props.updateUserRole(userId, newRole)
      .then(res => {
        toastr.success(res.data.message);
      })
      .catch(error => {
        toastr.error(error.response.data.message);
      });
  }

  /**
   * @desc this method calls the delete user endpoint, using the userId as params.
   * @param {number} userId
   *
   * @memberof ViewAllUsers
   * @returns {string} returns a succes message or error message
   */
  deleteUser(userId) {
    const id = userId;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this User',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.props.deleteUser(id, this.state.selectedPage)
          .then(res => {
            const successMsg = res.data.message;
            swal({
              title: 'Deleted!',
              text: successMsg,
              timer: 2000,
              type: 'success',
              showConfirmButton: false
            });
          })
          .catch(error => {
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
      swal('Cancelled', 'Your user is safe :)', 'error');
    });
  }


  render() {
    const { allUsers, query, isSearching, searchResult, selectedPage } = this.state;
    const { rows: view = [] } = (isSearching
      ? searchResult : allUsers) || [];
    const { totalPage } = allUsers;


    const navIndicators = Array(totalPage).fill().map((i, index) => {
      const classes = `${index === selectedPage ? 'active' : ''} waves-effect`;
      return <li
        key={`navost-${index}`}
        onClick={() => this.setPage(index)}
        className={classes}
      ><a href="#!">{index + 1}</a></li>;
    });

    return (
      <div>
        <div className="row">
          <SideNavBar
            user={this.props.user}
          />
          <SearchBar
            query={query}
            handleSearchInput={this.handleSearchInput}
          />
          <Back />
        </div>

        <div className="create-title center-align">
          All Users
        </div>

        <div className="row container users-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>&nbsp;</th>
              </tr>
            </thead>

            <tbody>
              {(view || []).map((user) =>
                (<AllUsersList
                  key={Math.random()}
                  user={user}
                  handleRoleChange={this.handleRoleChange}
                  deleteUser={this.deleteUser}
                />))}
            </tbody>
          </table>
        </div>

        <Pagination
          navIndicators={navIndicators}
          selectedPage={selectedPage}
          pages={totalPage}
        />

      </div>
    );
  }
}

ViewAllUsers.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  updateUserRole: PropTypes.func.isRequired,
  currentPage: PropTypes.number,
  user: PropTypes.object,
  allUsers: PropTypes.object,
  offset: PropTypes.string
};

export const mapStateToProps = ({ user }) => {
  const { currentUser, allUsers = {} } = user;
  return { user: currentUser, allUsers };
};

export default connect(mapStateToProps,
  {
    getAllUsers,
    updateUserRole,
    deleteUser
  })(ViewAllUsers);
