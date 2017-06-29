import React from 'react';
import PropTypes from 'prop-types';


export default function ViewAllUsersCard({ user, updateRole, deleteUser }) {

  return (
    <div className="card small docify-list col s3">
      <div className="card-content docify-last-name">
        <p className="docify-fn">{user.firstName}</p>
        <span>{user.lastName}</span>
      </div>
      <div className="card-action list-section">
        <span>{user.email}</span>
        <div className="docify-role">
          <span>{user.roleId}</span>
        </div>
      </div>

      <div className="row docify-users-btn-section">
        <div className="left-align">
          <a
            role="button"
            onClick={() => { updateRole(user.id); }}
            className="waves-effect waves-teal btn docify-update"
          >
          Update Role</a>
        </div>
        <div className="right-align">
          <a
            role="button"
            onClick={() => { deleteUser(user.id); }}
            className="waves-effect waves-teal btn docify-delete"
          >
          Delete User</a>
        </div>
      </div>
    </div>
  );
}

ViewAllUsersCard.propTypes = {
  user: PropTypes.object.isRequired,
  updateRole: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};
