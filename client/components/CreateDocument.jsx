import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { createDocument } from '../actions/documentActions';

/**
 *
 *
 * @desc represents Create Document Page.
 * @class CreateDocument
 * @extends {Component}
 */
export class CreateDocument extends Component {
  /**
   * Creates an instance of CreateDocument.
   * @param {object} props
   *
   * @memberof CreateDocument
   */
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      access: 'private',
      content: ''
    };
    this.saveDoc = this.saveDoc.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    CKEDITOR.replace('content');   // eslint-disable-line
  }

  /**
   *
   *
   * @param {any} event
   *
   * @memberof CreateDocument
   */
  handleFieldChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    const content = CKEDITOR.instances.content.getData();   // eslint-disable-line
    this.setState((state) => Object.assign({}, state, { [id]: value, content }));
  }

  /**
   *
   * @desc handles the submit action on the form.
   *  Calls the createDocument action.
   * @param {object} event
   *
   * @memberof CreateDocument
   * @returns {void}
   */
  saveDoc(event) {
    event.preventDefault();
    const docInput = { ...this.state };
    this.props.createDocument(docInput);
  }

  render() {
    const { title, access } = this.state;

    return (
      <div>
        <div className="create-title center-align">
          Create a New Document
        </div>

        <div className="docify-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
        </div>

        <div className="row container-fluid docify-create center-align" >
          <form className="col s12">
            <div className="row">
              <div className="input-field col s6">
                <input
                  placeholder="Document Title"
                  id="title"
                  onChange={this.handleFieldChange}
                  value={title}
                  type="text"
                  className="validate"
                />
                <label htmlFor="title" />
              </div>


              <div className="input-field col s6">
                <select
                  className="browser-default"
                  onChange={this.handleFieldChange}
                  id="access"
                  value={access}
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
                    className="materialize-textarea"
                  />
                  <label htmlFor="content" />
                </div>
              </div>
            </div>

            <button
              className="btn waves-effect waves-light docify-save"
              type="submit"
              name="action"
              onClick={this.saveDoc}
            >Save
              <i className="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

CreateDocument.propTypes = {
  createDocument: PropTypes.func.isRequired
};


export default connect(null, { createDocument })(CreateDocument);
