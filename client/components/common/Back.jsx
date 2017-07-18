import React from 'react';
import { browserHistory } from 'react-router';


/**
 * @desc back button
 *
 * @returns {jsx} returns jsx
 */
const Back = () => {
  return (
    <div className="docify-back right-align">
      <button
        className="waves-effect waves-teal btn-flat"
        onClick={() => browserHistory.push('/dashboard')}
      >Back</button>
    </div>
  );
};

export default Back;
