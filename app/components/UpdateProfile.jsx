import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import client from '../utils/client';

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user || {}
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    const id = this.props.id;
    if (!this.props.user) {
      client.get(`/api/users/${id}`)
        .then(res => {
          this.setState({ document: res.data });
        }, error => {
          toastr.error(error.response.data.message);
        });
    }
  }

  handleFieldChange(event) {
    const { id, value } = event.target;
    const field = id;
    this.setState({ user: { ...this.state.user, [field]: value } });
  }

  submitHandler(event) {
    event.preventDefault();
    const userId = this.props.user.id;
    const fieldData = this.state.user;
    client.put(`/api/users/${userId}`, fieldData)
      .then(res => {
        const successMsg = res.data.message;
        toastr.success(successMsg);
      }, error => {
        const errorMsg = error.response.data.message;
        toastr.error(errorMsg);
      });
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        <div className="create-title center-align">
          Edit your Profile
        </div>

        <div className="docify-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
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
                  value={user.firstName}
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
                  value={user.lastName}
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
                  value={user.username}
                />
                <label htmlFor="disabled">Username</label>
              </div>
            </div>

            <div className="row">
              <div
                className="input-field col s6"
              >
                <input
                  id="password"
                  type="password"
                  className="validate"
                  value={user.password}
                  onChange={this.handleFieldChange}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s6">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  value={user.email}
                  onChange={this.handleFieldChange}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12 s6">
                <button
                  className="btn waves-effect waves-light"
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
  user: PropTypes.object.isRequired
};


const mapStateToProps = ({ user }, { params }) => {
  const { id } = params;
  return {
    user,
    id
  };
};

export default connect(mapStateToProps)(UpdateProfile);
