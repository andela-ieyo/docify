import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';


const DashboardDocCards = ({ user, doc, deleteDoc }) => {
  return (
    <div className="col s6 m4">
      <div className="card small docify-card">
        <div className="card-content">
          <span className="card-title">{doc.title}</span>
          <p
            className="docify-p"
            dangerouslySetInnerHTML={{ __html: doc.content.slice(0, 200) }}
          />
        </div>
        <div className="card-action">
          <span>{doc.createdAt.slice(0, 10)}</span>
          <div className="docify-icons">
            <a
              role="button"
              id="doc-view"
              onClick={() => browserHistory.push(`documents/view/${doc.id}`)}
              className="btn-small waves-effect waves-light docify-view"
            >View</a>
            <button
              disabled={user.id !== doc.ownerId}
              id="doc-edit"
              onClick={() => browserHistory.push(`documents/edit/${doc.id}`)}
              className="btn-small waves-effect waves-light docify-view"
            >Edit</button>
            <button
              disabled={user.roleId !== 3 && user.id !== doc.ownerId}
              id="doc-delete"
              onClick={() => { deleteDoc(doc.id); }}
              className="btn-small waves-effect waves-light docify-view"
            >delete</button>
          </div>
        </div>
        <div className="docify-access-section center-align">
          <span>{doc.access}</span>
        </div>
        <div className="docify-owner-section center-align">
          <span>{doc.User.firstName} {doc.User.lastName}</span>
        </div>
      </div>
    </div>);
};

DashboardDocCards.propTypes = {
  user: PropTypes.object.isRequired,
  doc: PropTypes.object.isRequired,
  deleteDoc: PropTypes.func.isRequired
};

export default DashboardDocCards;
