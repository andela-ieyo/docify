import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
// import toastr from 'toastr';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import {
  retrieveMyDocuments,
  retrieveAllDocuments, searchDocs } from '../actions/documentActions';
import logOut from '../actions/logOutAction';
import client from '../utils/client';


const updateFilters = (value) => (state) => {
  const itemExist = state.filters.includes(value);
  if (!itemExist) {
    return { filters: [...state.filters, value] };
  }
  return { filters: state.filters.filter(i => i !== value) };
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents || {},
      view:'allDocuments',
      filters: [],
      query: '',
      isSearching: false,
      hide: 'hide'
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.onSubmitSearch = this.onSubmitSearch.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
    this.deleteMyAccount = this.deleteMyAccount.bind(this);
  }


  componentWillMount() {
    const isAdmin = this.props.user.roleId === 3;
    if (isAdmin) {
      this.setState({ hide: 'show' });
    }
  }

  componentDidMount() {
    const userId = this.props.user.id;
    this.props.retrieveMyDocuments(userId);
    this.props.retrieveAllDocuments();
    $('.button-collapse').sideNav({ 'closeOnClick': true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents) {
      this.setState({
        documents: nextProps.documents
      });
    }
  }

  handleOptionChange(event) {
    const { value } = event.target;
    this.setState({ view: value });
  }

  handleCheckBoxChange(event) {
    const { value } = event.target;
    this.setState(updateFilters(value));
  }

  handleSearchInput(event) {
    const { value } = event.target;
    this.setState({ query: value });
    const query = this.state.query;
    this.props.searchDocs(query);
    this.setState({ isSearching: true });
    console.log(value, query);
  }

  deleteMyAccount(userId) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        client.delete(`/api/users/${userId}`)
          .then(res => {
            const successMsg = res.data.message;
            swal({
              title: 'Deleted!',
              text: successMsg,
              timer: 2000,
              type: 'success',
              showConfirmButton: false
            });
            this.props.logOut();
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
      swal('Cancelled', 'Your account is safe :)', 'error');
    }
      );
  }

  onSubmitSearch() {
    event.preventDefault();
    const query = this.state.query;
    console.log(query, 'query');
    this.props.searchDocs(query);
    this.setState({ isSearching: true });
  }

  deleteDoc(docId) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        client.delete(`/api/documents/${docId}`)
          .then(res => {
            const successMsg = res.data.message;
            this.props.retrieveAllDocuments();
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
      swal('Cancelled', 'Your file is safe :)', 'error');
    }
      );
  }

  render() {
    console.log(this.props.documents.searchDocuments, 'state');
    const role = this.props.user.roleId === 1 ? 'writer' : 'editor';
    const { filters, query, hide, isSearching } = this.state;
    const { documents } = this.props;
    console.log(documents.searchDocuments, 'ren');
    const selectDocView = isSearching ? documents.searchDocuments : documents[this.state.view]; // documents[this.state.view]
    const filteredDocs = (selectDocView || []).filter(
      doc => filters.includes(doc.access) || filters.length === 0
    );
    return (
      <div>
        <ul id="slide-out" className="side-nav">
          <li>
            <div className="userView">
              <span className="name">Welcome {this.props.user.lastName}</span>
              <span className="email">{this.props.user.email}</span>
            </div>
          </li>

          <li><a
            role="button"
            onClick={() => {
              this.deleteMyAccount(this.props.user.id);
            }}
          >Delete your account</a></li>

          <li className={hide}>
             Admin
          </li>
          <li><a
            role="button"
            onClick={() => {
              browserHistory.push(`/users/profile/edit/${this.props.user.id}`);
            }}
          >Update profile</a></li>
          <li><div className="divider" /></li>
          <li className={hide}>
            <a
              role="button"
              onClick={() => {
                browserHistory.push('/users/all');
              }}
            > View All Users</a>
          </li>
        </ul>
        <a data-activates="slide-out" className="button-collapse">
          <i className="Small material-icons docify-menu">menu</i>
        </a>

        <div className="right-align docify-add">
          <button
            className="btn-floating btn-medium waves-effect waves-light red"
            onClick={() =>
              browserHistory.push('/create-document')
            }
          >
            <i className="material-icons">add</i></button>
        </div>

        <div className="row docify-search">
          <form>
            <div className="row">
              <div className="input-field">
                <input
                  placeholder="Search for a document"
                  onChange={this.handleSearchInput}
                  value={query}
                  id="search"
                  type="text"
                  className="validate col s8"
                />
                <a
                  role="button"
                  onClick={this.onSubmitSearch}
                  className="btn-floating search-wrapper"
                ><i className="material-icons col s4 search-icon">search</i></a>
              </div>
            </div>
          </form>
        </div>
        {/* CheckBoxes */}
        <div className="row docify-checkbox">
          <form className="col s6">
            <div className="row">
              <p>
                <input
                  type="checkbox"
                  id="private"
                  className="filled-in col s2"
                  value="private"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="private">Private</label>

                <input
                  type="checkbox"
                  id="public"
                  value="public"
                  className="filled-in col s2"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="public">Public</label>

                <input
                  type="checkbox"
                  id="role"
                  value={role}
                  className="filled-in col s2"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="role">Role</label>
              </p>
            </div>
          </form>

          <div className="col s4">
            <div className="input-field">
              <select
                className="browser-default"
                onChange={this.handleOptionChange}
                id="docify-option"
                value={this.state.view}
              >
                <option value="myDocuments">Owned by Me</option>
                <option value="allDocuments">Shared with Me</option>
              </select>
            </div>
          </div>
        </div>


        <div className="row container-fluid doc-card" >
          {filteredDocs.map(doc =>
            (<div className="col s6 m4" key={doc.id}>
              <div className="card small docify-card">
                <div className="card-content">
                  <span className="card-title">{doc.title}</span>
                  <p className="docify-p">{doc.content.slice(0, 200)}...</p>
                </div>
                <div className="card-action">
                  <span>{doc.createdAt.slice(0, 10)}</span>
                  <div className="docify-icons">
                    <a
                      role="button"
                      onClick={() => browserHistory.push(`documents/view/${doc.id}`)}
                      className="btn-small waves-effect waves-light"
                    >View</a>
                    <a
                      role="button"
                      onClick={() => browserHistory.push(`documents/edit/${doc.id}`)}
                      className="btn-small waves-effect waves-light"
                    >Edit</a>
                    <a
                      role="button"
                      onClick={() => { this.deleteDoc(doc.id); }}
                      className="btn-small waves-effect waves-light"
                    >delete</a>
                  </div>
                </div>
                <div className="docify-access-section center-align">
                  <span>{doc.access}</span>
                </div>
              </div>
            </div>)
            )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  retrieveMyDocuments: PropTypes.func.isRequired,
  retrieveAllDocuments: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  searchDocs: PropTypes.func.isRequired,
  documents: PropTypes.object
};

Dashboard.defaultProps = {
  documents: {}
};

const mapStateToProps = ({ user, documents }) => ({ user, documents });

export default connect(mapStateToProps,
  {
    retrieveMyDocuments,
    retrieveAllDocuments,
    logOut,
    searchDocs
  })(Dashboard);
