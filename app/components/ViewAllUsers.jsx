import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import toastr from 'toastr';
import client from '../utils/client';
import ViewAllUsersCard from './ViewAllUsersCard.jsx';
import { getUser } from '../actions/getUser';

class ViewAllUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.updateRole = this.updateRole.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentWillMount() {
    client.get('/api/users/')
    .then(res => {
      this.setState({ users: res.data });
    }, error => {
      toastr.error(error.response.data.message);
    });
  }

  updateRole(userId) {
    const id = userId;
    swal({
      title: 'Update Role',
      text: 'Type in the new Role Id',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'type the new role Id'
    }, (inputValue) => {
      if (inputValue === false) { return false; }

      if (inputValue === '') {
        swal.showInputError('You need to write something!');
        return false;
      }
      swal('Nice!', `You changed roleId to: ${inputValue}`, 'success');
      const newRoleId = { roleId: parseInt(inputValue, 10) };
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
    const { users } = this.state;
    return (
      <div>
        <div className="docify-list-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
        </div>

        <div className="row container-fluid users-list">
          {users.map((user, key) =>
            (<ViewAllUsersCard
              user={user}
              key={user.id}
              updateRole={this.updateRole}
              deleteUser={this.deleteUser}
            />))}
        </div>
      </div>
    );
  }
}

ViewAllUsers.propTypes = {
  getUser: PropTypes.func.isRequired
};


export default connect(null, { getUser })(ViewAllUsers);
