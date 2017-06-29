/* global $ */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import {
  retrieveMyDocuments,
  retrieveAllDocuments, searchDocs } from '../actions/documentActions';
import logOut from '../actions/logOutAction';
import client from '../utils/client';
import CheckBoxes from './CheckBoxes.jsx';
import DashboardDocCards from './DashboardDocCards.jsx';


export const updateFilters = (value) => (state) => {
  const itemExist = state.filters.includes(value);
  if (!itemExist) {
    return { filters: [...state.filters, value] };
  }
  return { filters: state.filters.filter(i => i !== value) };
};

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
      view:'allDocuments',
      filters: [],
      query: '',
      isSearching: false,
      selectedPage: 0,
      hide: 'hide',
      show: 'show'
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
    this.deleteMyAccount = this.deleteMyAccount.bind(this);
    this.setPage = this.setPage.bind(this);
    this.deleteAndLogout = this.deleteAndLogout.bind(this);
    this.showEmailConfirm = this.showEmailConfirm.bind(this);
  }


  componentWillMount() {
    const isAdmin = this.props.user.roleId === 3;
    if (isAdmin) {
      this.setState({ hide: 'show', show: 'hide' });
    }
  }

  componentDidMount() {
    const userId = this.props.user.id;
    this.props.retrieveMyDocuments(userId, this.state.selectedPage);
    this.props.retrieveAllDocuments(this.state.selectedPage);
    $('.button-collapse').sideNav({ 'closeOnClick': true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents) {
      this.setState({
        documents: nextProps.documents
      });
    }
  }
  /**
   *
   * @desc sets a new page displaying user documents.
   * @param {number} page
   *
   * @memberof Dashboard
   * @returns {array} returns an array of document objects
   */
  setPage(page) {
    const userId = this.props.user.id;
    if (this.state.selectedPage !== page) {
      this.setState({ selectedPage: page });
      if (this.state.isSearching) {
        return this.props.searchDocs(this.state.query, page);
      }
      this.props.retrieveMyDocuments(userId, page);
      this.props.retrieveAllDocuments(page);
    }
  }

  /**
   *
   * @desc handles onChange event in the form select field.
   * @param {object} event
   *
   * @memberof Dashboard
   * @returns {void}
   */
  handleOptionChange(event) {
    const { value } = event.target;
    this.setState({ view: value });
  }

  /**
   *
   * @desc handles onChange event on the form checkBox.
   * @param {object} event
   *
   * @memberof Dashboard
   */
  handleCheckBoxChange(event) {
    const { value } = event.target;
    this.setState(updateFilters(value));
  }

  /**
   * @desc handles onChange event in the form input field.
   *
   * @param {object} event
   *
   * @memberof Dashboard
   */
  handleSearchInput(event) {
    const { value } = event.target;
    this.props.searchDocs(value, this.state.selectedPage);
    this.setState({ isSearching: value.length > 0, query: value });
  }

  /**
   *
   * @desc pops a modal that prompts the user to insert his email.
   * @param {string} email
   *
   * @memberof Dashboard
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
   *
   * @desc calls the delete user account endpoint.
   * It requires the user's email as query.
   * @param {string} email
   *
   * @memberof Dashboard
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
   * @memberof Dashboard
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

  /**
   *
   * @desc calls the delete endpoint to delete a specific document.
   * It requires the docId of the document as params.
   * @param {string} docId
   *
   * @memberof Dashboard
   */
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
    const role = this.props.user.roleId === 1 ? 'writer' : 'editor';
    const { filters, query, hide, show, isSearching, selectedPage } = this.state;
    const { documents } = this.props;
    const { rows: selectDocView = [], count = 0 } = (isSearching
      ? documents.searchDocuments : documents[this.state.view]) || {};

    const filteredDocs = (selectDocView || []).filter(
      doc => filters.includes(doc.access) || filters.length === 0
    );
    const pages = Math.ceil(count / 2);
    const navIndicators = Array(pages).fill().map((i, index) => {
      const classes = `${index === selectedPage ? 'active' : ''} waves-effect`;
      return <li key={`navost-${index}`} onClick={() => this.setPage(index)} className={classes}><a href="#!">{index + 1}</a></li>;
    });

    return (
      <div>
        <ul id="slide-out" className="side-nav">
          <li>
            <div className="userView">
              <span className="name">Welcome {this.props.user.lastName}</span>
              <span className="email">{this.props.user.email}</span>
            </div>
          </li>

          <li className={show}><a
            role="button"
            className="delete-profile"
            onClick={() => {
              this.deleteMyAccount(this.props.user.email);
            }}
          >Delete your account</a></li>

          <li className={hide}>
            <span className="span-admin">
               Admin
            </span>
          </li>

          <li><a
            className="update-profile"
            role="button"
            onClick={() => {
              browserHistory.push(`/users/profile/edit/${this.props.user.id}`);
            }}
          >Update profile</a></li>

          <li className={hide} id="view-all">
            <a
              role="button"
              className="view-all-docify"
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
            className="btn-floating btn-medium waves-effect waves-light red docify-create-doc"
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
                <i className="material-icons col s4 search-icon">search</i>
              </div>
            </div>
          </form>
        </div>
        {/* CheckBoxes */}
        <CheckBoxes
          handleCheckBoxChange={this.handleCheckBoxChange}
          handleOptionChange={this.handleOptionChange}
          role={role}
          view={this.state.view}
        />

        <div className="row container-fluid doc-card" >
          {filteredDocs.map(doc =>
            <DashboardDocCards
              key={doc.id}
              doc={doc}
              user={this.props.user}
              deleteDoc={this.deleteDoc}

            />
            )}

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
