import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { createDocument } from '../actions/documentActions';

class CreateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      access: '',
      content: '',
      errors: {}
    };
    this.saveDoc = this.saveDoc.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }


  handleFieldChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    console.log(event.target);
    this.setState((state) => Object.assign({}, state, { [id]: value }));
  }

  saveDoc(event) {
    event.preventDefault();
    this.props.createDocument(this.state);
  }

  render() {
    const { title, access, content } = this.state;
    console.log(this.state);

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
                <label htmlFor="title">Title</label>
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
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="row">
                <div className="input-field col s12">
                  <i
                    className="material-icons prefix"
                  >mode_edit</i>
                  <textarea
                    id="content"
                    onChange={this.handleFieldChange}
                    value={content}
                    className="materialize-textarea"
                  />
                  <label htmlFor="content">Content</label>
                </div>
              </div>
            </div>

            <button
              className="btn waves-effect waves-light"
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
