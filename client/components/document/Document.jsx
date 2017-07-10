/* global $ */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { SideNavBar } from '../common/SideNavBar.jsx';
import client from '../../utils/client';
import SearchBar from '../layout/SearchBar.jsx';
import {
  getCategoryDocuments,
  deleteDocument } from '../../actions/documentActions';
import DocCard from './common/DocCard.jsx';
import Back from '../common/Back.jsx';
import Pagination from '../common/Pagination.jsx';

/**
 * @desc  Document component
 *
 * @class Document
 * @extends {Component}
 */
export class Document extends Component {
  /**
   * Creates an instance of Document.
   * @param {any} props
   * @memberof Document
   */
  constructor(props) {
    super(props);
    this.state = {
      searchResult: [],
      isSearching: false,
      query: '',
      selectedPage: 0,
      documents: props.categoryDocuments || {}
    };

    this.deleteDoc = this.deleteDoc.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.setPage = this.setPage.bind(this);
  }

  componentDidMount() {
    $('.button-collapse').sideNav({ 'closeOnClick': true });
    this.props.getCategoryDocuments(this.state.selectedPage, this.props.params.category);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryDocuments) {
      this.setState({
        documents: nextProps.categoryDocuments
      });
    }
  }

    /**
   *
   * @desc sets a new page displaying user documents.
   * @param {number} page
   *
   * @memberof Document
   * @returns {array} returns an array of document objects
   */
  setPage(page) {
    if (this.state.selectedPage !== page) {
      this.setState({ selectedPage: page });
      if (this.state.isSearching) {
        client.get(`/api/search/documents/?docTitle=${this.state.query}&page=${page}&limit=6`)
          .then(res => {
            this.setState({ searchResult: res.data });
          }, error => {
            toastr.error(error.response.data.message);
          });
      }
      return this.props.getCategoryDocuments(page, this.props.params.category);
    }
  }

  /**
   * @desc handles onChange event in the search Bar.
   *
   * @param {object} event
   *
   * @memberof Document
   */
  handleSearchInput(event) {
    const { value } = event.target;
    this.setState({ isSearching: value.length > 0, query: value });
    client.get(`/api/search/documents/?docTitle=${this.state.query}&page=${this.state.selectedPage}&limit=6`)
      .then(res => {
        this.setState({ searchResult: res.data });
      }, error => {
        toastr.error(error.response.data.message);
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
        this.props.deleteDocument(docId, this.selectedPage, this.props.params.category)
          .then(res => {
            const successMsg = res.data.message;
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
    const { query, isSearching, selectedPage, documents, searchResult } = this.state;
    const viewDocs = documents.rows;
    const { rows: selectDocView = [] } = (isSearching
      ? searchResult : documents) || [];

    const { totalPage } = documents;

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

        <div className="row container-fluid doc-card" >
          {(viewDocs || []).length === 0
            ? <div
              className="container center-align no-document"
            >
              You don&rsquo;t have any document. Create some now.
            </div>
            : selectDocView.map(doc =>
            (<DocCard
              key={doc.id}
              doc={doc}
              user={this.props.user}
              deleteDoc={this.deleteDoc}
              category={this.props.params.category}
            />)
          )}
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

Document.propTypes = {
  user: PropTypes.object.isRequired,
  getCategoryDocuments: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documents: PropTypes.object,
  params: PropTypes.object,
  categoryDocuments: PropTypes.object
};

Document.defaultProps = {
  documents: {}
};

export const mapStateToProps = ({ user, documents }, { params: { category } }) => {
  const { currentUser = {} } = user;
  const categoryDocuments = documents[`${category}Documents`];
  return { user: currentUser, categoryDocuments };
};

export default connect(mapStateToProps,
  {
    getCategoryDocuments,
    deleteDocument
  })(Document);
