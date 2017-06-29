import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import client from '../utils/client';


/**
 *
 *
 * @desc reprsents the View Document Page.
 * @class ViewDocument
 * @extends {Component}
 */
export class ViewDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: props.document || {}
    };
  }

  componentDidMount() {
    const id = this.props.id;
    if (!this.props.document) {
      client.get(`/api/documents/${id}`)
        .then(res => {
          this.setState({ doc: res.data });
        }, error => {
          toastr.error(error.response.data.message);
        });
    }
  }

  render() {
    const { doc } = this.state;

    return (
      <div>
        <div className="view-back right-align">
          <button
            className="waves-effect waves-teal btn-flat"
            onClick={() => browserHistory.push('/dashboard')}
          >Back</button>
        </div>

        <div className="view-section" key="doc.id">
          <div className="doc-title center-align">
            {doc.title}
          </div>

          <div className="doc-content center-align">
            <p dangerouslySetInnerHTML={{ __html: doc.content }} />
          </div>
        </div>
      </div>
    );
  }
}

ViewDocument.propTypes = {
  document: PropTypes.object
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

export default connect(mapStateToProps)(ViewDocument);
