import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-materialize';
import { browserHistory } from 'react-router';
import { Roles } from '../../../utils/roles';

/**
 * @desc card view of documents
 *
 * @param {object} { user, doc }
 * @returns {jsx} returns jsx
 */
const DocCard = ({ user, doc, deleteDoc, category }) => {
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
            <Modal
              header={doc.title}
              trigger={<a
                role="button"
                id="doc-view"
                className="btn-small waves-effect waves-light docify-view"
              >View</a>}
            >
              <div
                className="document__content"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            </Modal>
            {user.id === doc.User.id
            ? <button
              id="doc-edit"
              className="btn-small waves-effect waves-light docify-view"
              onClick={() => browserHistory.push(`/document/edit/${category}/${doc.id}`)}
            >Edit</button> : '' }

            {user.roleId === Roles.Admin || user.id === doc.User.id
              ? <button
                id="doc-delete"
                onClick={() => { deleteDoc(doc.id); }}
                className="btn-small waves-effect waves-light docify-view"
              >Delete</button> : '' }
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

DocCard.propTypes = {
  user: PropTypes.object,
  doc: PropTypes.object,
  deleteDoc: PropTypes.func.isRequired,
  category: PropTypes.string
};

export default DocCard;
