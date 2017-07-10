/* global $ */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import {
  getCategoryDocuments } from '../../actions/documentActions';
import { getAllUsers } from '../../actions/userActions';
import { SideNavBar } from '../common/SideNavBar.jsx';
import DashboardCard from './DashboardCard.jsx';
import { Roles } from '../../utils/roles';


/**
 * @desc represents the Dashboard component
 *
 * @class Dashboard
 * @extends {Component}
 */
export class Dashboard extends Component {
  /**
   * Creates an instance of Dashboard.
   * @param {any} props
   *
   * @memberof Dashboard
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 0
    };
  }

  componentDidMount() {
    $('.button-collapse').sideNav({ 'closeOnClick': true });
    this.props.getCategoryDocuments(this.state.selectedPage, 'private');
    this.props.getCategoryDocuments(this.state.selectedPage, 'public');
    this.props.getCategoryDocuments(this.state.selectedPage, 'role');

    if (this.props.user.roleId === Roles.Admin) {
      this.props.getAllUsers(this.state.selectedPage);
    }
  }

  render() {
    const { lastName, roleId } = this.props.user;
    const { allUsers } = this.props;
    const {
      privateDocuments = {},
      publicDocuments = {},
      roleDocuments = {}
    } = this.props.documents;

    return (
      <div>
        {/* sideNavBar */}
        <div className="row">
          <SideNavBar
            user={this.props.user}
          />
        </div>

        <div className="row">
          <div className="dashboard-welcome-msg center-align">
            Welcome back {lastName}
          </div>
        </div>

        <div className="row">
          <div className="top-cards">
            <DashboardCard
              title="Private"
              details={`${privateDocuments.count} Document(s)`}
              icon="folder"
              link="document/private"
            />
            <DashboardCard
              title="Public"
              details={`${publicDocuments.count} Document(s)`}
              icon="folder"
              link="document/public"
            />
            <DashboardCard
              title="Role"
              details={`${roleDocuments.count} Document(s)`}
              icon="folder"
              link="document/role"
            />
            {
              roleId === Roles.Admin
              ? <DashboardCard
                title="View All Users"
                details={`${allUsers.count} User(s)`}
                icon="user"
                link="/users/all"
              /> : ''
            }

            <div className="right-align docify-add">
              <button
                id="docify-add-doc"
                className="btn-floating btn-large waves-effect waves-light red docify-create-doc"
                onClick={() =>
                  browserHistory.push('/create-document')
                }
              >
                <i className="material-icons add">add</i></button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  getCategoryDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  documents: PropTypes.object,
  allUsers: PropTypes.object
};

Dashboard.defaultProps = {
  documents: {}
};

const mapStateToProps = ({ user, documents }) => {
  const { currentUser = {}, allUsers = {} } = user;
  return {
    user: currentUser,
    allUsers,
    documents
  };
};

export default connect(mapStateToProps,
  {
    getCategoryDocuments,
    getAllUsers
  })(Dashboard);
