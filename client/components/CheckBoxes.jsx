import React from 'react';
import PropTypes from 'prop-types';

const CheckBoxes = ({ handleCheckBoxChange, handleOptionChange, role, view }) =>
  <div className="row docify-checkbox">
    <form className="col s6">
      <div className="row">
        <p>
          <input
            type="checkbox"
            id="private"
            className="filled-in col s2"
            value="private"
            onClick={handleCheckBoxChange}
          />
          <label htmlFor="private">Private</label>

          <input
            type="checkbox"
            id="public"
            value="public"
            className="filled-in col s2"
            onClick={handleCheckBoxChange}
          />
          <label htmlFor="public">Public</label>

          <input
            type="checkbox"
            id="role"
            value={role}
            className="filled-in col s2 docify-check"
            onClick={handleCheckBoxChange}
          />
          <label htmlFor="role">Role</label>
        </p>
      </div>
    </form>

    <div className="col s4">
      <div className="input-field">
        <select
          className="browser-default"
          onChange={handleOptionChange}
          id="docify-option"
          value={view}
        >
          <option value="myDocuments">Owned by Me</option>
          <option value="allDocuments">All Documents</option>
        </select>
      </div>
    </div>
  </div>;

CheckBoxes.propTypes = {
  handleCheckBoxChange: PropTypes.func.isRequired,
  handleOptionChange: PropTypes.func.isRequired,
  role: PropTypes.string,
  view: PropTypes.string
};


export default CheckBoxes;
