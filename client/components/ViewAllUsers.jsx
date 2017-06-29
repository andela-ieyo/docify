import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import toastr from 'toastr';
import client from '../utils/client';
import ViewAllUsersCard from './ViewAllUsersCard.jsx';
import { getUser } from '../actions/getUser';

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
      users: [],
      searchResult: [],
      query: '',
      isSearching: false,
      selectedPage: 0
    };
    this.updateRole = this.updateRole.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  componentWillMount() {
    client.get(`/api/users/?page=${this.state.selectedPage}&limit=6`)
    .then(res => {
      console.log(res.data, 'oooo');
      this.setState({ users: res.data });
    }, error => {
      toastr.error(error.response.data.message);
    });
  }

  /**
   *
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
          this.setState({ users: res.data });
        }, error => {
          toastr.error(error.response.data.message);
        });
    }
  }


  /**
   *
   *
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
   *
   * @desc this method calls the update a user's role endpoint, using the userId as params.
   * @param {number} userId
   *
   * @memberof ViewAllUsers
   * @returns {string} returns a success message or error message
   */
  updateRole(userId) {
    const id = userId;
    swal({
      title: 'Update Role',
      text: 'Type in the new Role Title',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'type the new role title'
    }, (inputValue) => {
      if (inputValue === false) { return false; }

      if (inputValue === '') {
        swal.showInputError('You need to write something!');
        return false;
      }
      swal('Nice!', `You changed roleId to: ${inputValue}`, 'success');
      let newRoleId;
      if (inputValue.toLowerCase() === 'writer') {
        newRoleId = Object.assign({}, { roleId: 1 });
      }

      if (inputValue.toLowerCase() === 'editor') {
        newRoleId = Object.assign({}, { roleId: 2 });
      }

      return client.put(`/api/users/role/${id}`, newRoleId)
        .then(res => {
          const successMsg = res.data.message;
          toastr.success(successMsg);
          this.props.getUser(id);
          client.get('/api/users/')
            .then(response => {
              this.setState({ users: response.data });
            }, error => {
              toastr.error(error.response.data.message);
            });
        }, error => {
          const errorMsg = error.response.data.message;
          toastr.error(errorMsg);
        });
    });
  }

  /**
   *
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
        client.delete(`/api/users/${id}`)
          .then(res => {
            const successMsg = res.data.message;
            client.get('/api/users/')
              .then(response => {
                this.setState({ users: response.data });
              }, error => {
                toastr.error(error.response.data.message);
              });
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
      swal('Cancelled', 'Your user is safe :)', 'error');
    }
      );
  }


  render() {
    const { users, query, isSearching, searchResult, selectedPage } = this.state;
    const { rows: view = [], count = 0 } = (isSearching
      ? searchResult : users) || [];

    const pages = Math.ceil(count / 2);

    const navIndicators = Array(pages).fill().map((i, index) => {
      const classes = `${index === selectedPage ? 'active' : ''} waves-effect`;
      return <li key={`navost-${index}`} onClick={() => this.setPage(index)} className={classes}><a href="#!">{index + 1}</a></li>;
    });

    return (
      <div>

        <div className="row docify-users-search">
          <form>
            <div className="row">
              <div className="input-field">
                <input
                  placeholder="Search for a document"
                  id="search"
                  type="text"
                  value={query}
                  onChange={this.handleSearchInput}
                  className="validate col s8"
                />
                <i className="material-icons col s4 search-icon">search</i>
              </div>
            </div>
          </form>
        </div>

        <div className="docify-list-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
        </div>

        <div className="row container-fluid users-list">
          {view.map((user, key) =>
            (<ViewAllUsersCard
              user={user}
              key={user.id}
              updateRole={this.updateRole}
              deleteUser={this.deleteUser}
            />))}
        </div>

        <div className="pagination-wrapper row">
          {pages > 1 && <ul className="pagination">
            <li className={`${selectedPage === 0 ? 'disabled' : 'waves-effect'}`}>
              <a href="#!"><i className="material-icons">chevron_left</i></a>
            </li>
              {navIndicators}
            <li className={`${selectedPage + 1 > pages ? 'disabled' : 'waves-effect'}`}>
              <a href="#!"><i className="material-icons">chevron_right</i></a>
            </li>
            </ul>}
        </div>
      </div>
    );
  }
}

ViewAllUsers.propTypes = {
  getUser: PropTypes.func.isRequired
};


export default connect(null, { getUser })(ViewAllUsers);
