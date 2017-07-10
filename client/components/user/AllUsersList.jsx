/* global $ */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from 'react-materialize';
import { Roles, chooseTitle } from '../../utils/roles';

class AllUsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      Role: {
        id: props.user.Role.id,
        title: props.user.Role.title
      }
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

 /**
   * @desc handles on change event for role update.
   *
   * @param {object} event - select form event
   * @memberof AllUsersList
   */
  handleOnChange(event) {
    const { value } = event.target;
    console.log(value, 'here');
    const newRoleId = parseInt(value, 10);
    const title = chooseTitle(newRoleId);

    this.setState({
      Role: {
        id: newRoleId,
        title
      }
    });
  }

  render() {
    const { user, Role } = this.state;
    console.log(Role.title, 'state');
    return (
      <tr key={user.id}>
        <td>
          {user.firstName} {user.lastName}
        </td>
        <td>{user.email}</td>
        <td>{user.Role.title}</td>
        <td className="role-btn">
          <Modal
            id="roleChange"
            header="Update Role"
            trigger={
             user.Role.id !== Roles.Admin
             ? <a
               role="button"
               className="waves-effect waves-teal btn docify-update"
             >
             Update Role
            </a> : ''
          }
          >
            <form>
              <div className="input-field col s12">
                <select
                  id="role-select"
                  type="select"
                  value={Role.title}
                  className="browser-default"
                  onChange={this.handleOnChange}
                >
                  <option value="">Choose Role</option>
                  <option value="1">Writer</option>
                  <option className="editor" value="2">Editor</option>
                  <option value="3">Admin</option>
                </select>
              </div>

              <div className="input-field col s12">
                <Button
                  waves="light"
                  id="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    $('#roleChange').modal('close');
                    this.props.handleRoleChange(user.id, Role);
                  }}
                >Submit</Button>
              </div>
            </form>
          </Modal>

          { user.Role.id !== Roles.Admin
           ? <a
             role="button"
             onClick={() => { this.props.deleteUser(user.id); }}
             className="waves-effect waves-teal btn docify-delete"
           >
             Delete User
           </a> : ''
          }
        </td>
      </tr>
    );
  }
}

AllUsersList.propTypes = {
  user: PropTypes.object.isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default AllUsersList;
