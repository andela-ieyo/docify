import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { saveEditedDoc } from '../actions/documentActions';
import client from '../utils/client';

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
    CKEDITOR.replace('content');   // eslint-disable-line
    const id = this.props.id;
    if (!this.props.document) {
      client.get(`/api/documents/${id}`)
        .then(res => {
          this.setState({ document: res.data });
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
    // fieldData.content = content;
    this.props.saveEditedDoc(docId, fieldData);
  }

  render() {
    const { document } = this.state;

    return (
      <div>
        <div className="create-title center-align">
          Edit this document
        </div>

        <div className="docify-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
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
  saveEditedDoc: PropTypes.func.isRequired
};


export const mapStateToProps = ({ documents }, { params }) => {
  const { allDocuments = {} } = documents;
  const { id } = params;
  const document = (allDocuments.rows || []).find(doc => doc.id === parseInt(id, 10));
  return {
    document,
    id
  };
};

export default connect(mapStateToProps, { saveEditedDoc })(EditDocument);
