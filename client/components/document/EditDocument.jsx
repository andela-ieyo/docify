/* global $ */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { saveEditedDoc } from '../../actions/documentActions';
import { SideNavBar } from '../common/SideNavBar.jsx';
import Back from '../common/Back.jsx';
import client from '../../utils/client';

/**
 * @desc represents the Editdocument Page
 *
 * @class EditDocument
 * @extends {Component}
 */
export class EditDocument extends Component {
  /**
   * Creates an instance of EditDocument.
   * @param {object} props
   *
   * @memberof EditDocument
   */
  constructor(props) {
    super(props);
    this.state = {
      document: props.document || {}
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
   // eslint-disable-line
    $('.button-collapse').sideNav({ 'closeOnClick': true });

    const id = this.props.id;
    if (!this.props.document) {
      client.get(`/api/documents/${id}`)
        .then(res => {
          this.setState({ document: res.data });
          CKEDITOR.replace('content');
        }, error => {
          toastr.error(error.response.data.message);
        });
    }
  }
  /**
   * @desc handles onChange event on the form input fields.
   *
   * @param {object} event
   *
   * @memberof EditDocument
   */
  handleFieldChange(event) {
    const { id, value } = event.target;
    const field = id;
    this.setState({ document: { ...this.state.document, [field]: value } });
  }

  /**
   * @desc handles the submit event of the form.
   * Calls the saveEditedDoc action.
   *
   * @param {any} event
   *
   * @memberof EditDocument
   * @returns {void}
   */
  submitHandler(event) {
    event.preventDefault();
    const content = CKEDITOR.instances.content.getData();   // eslint-disable-line
    const docId = this.state.document.id;
    const fieldData = { ...this.state.document, content };
    const { category } = this.props;
    this.props.saveEditedDoc(docId, fieldData, category)
      .then((res) => {
        const { message } = res.data;
        toastr.success(message);
      })
      .catch(error => {
        const errorMsg  = error.response.data.message;
        toastr.error(errorMsg);
      });
  }

  render() {
    const { document } = this.state;

    return (
      <div>
        <div className="row">
          <SideNavBar
            user={this.props.user}
          />
          <div className="create-title center-align">
            Edit this document
          </div>
          <Back />
        </div>

        <div className="row container-fluid docify-create center-align">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s6">
                <input
                  placeholder="Document Title"
                  id="title"
                  value={document.title || ''}
                  onChange={this.handleFieldChange}
                  type="text"
                />
                <label htmlFor="title" />
              </div>

              <div className="input-field col s6">
                <select
                  className="browser-default"
                  onChange={this.handleFieldChange}
                  id="access"
                  value={document.access}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <optgroup label="Role">
                    <option value="writer">Writer</option>
                    <option value="editor">Editor</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="row">
                <div className="input-field col s12">
                  <textarea
                    id="content"
                    value={document.content || ''}
                    className="materialize-textarea"
                    onChange={() => null}
                  />
                  <label htmlFor="content" />
                </div>
              </div>
            </div>

            <button
              className="btn waves-effect waves-light docify-save-edit"
              type="submit"
              name="action"
              onClick={this.submitHandler}
            >Save
          <i className="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

EditDocument.propTypes = {
  document: PropTypes.object,
  user: PropTypes.object,
  saveEditedDoc: PropTypes.func.isRequired,
  category: PropTypes.string
};


export const mapStateToProps = ({ documents, user }, { params }) => {
  const { currentUser = {} } = user;
  const { id, category } = params;
  const { [category] : { rows = [] } = {} } = documents;
  const document = rows.find(doc => doc.id === parseInt(id, 10));
  return {
    document,
    id,
    category,
    user: currentUser
  };
};

export default connect(mapStateToProps, { saveEditedDoc })(EditDocument);
