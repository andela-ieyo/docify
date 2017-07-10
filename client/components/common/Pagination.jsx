import React from 'react';
import PropTypes from 'prop-types';


const Pagination = ({ pages, selectedPage, navIndicators }) => {
  return (
    <div>
      <div className="pagination-wrapper">
        {pages > 1 && <ul className="pagination">
          <li className={`${selectedPage === 0 ? 'disabled' : 'waves-effect'}`}>
            <a href="#!"><i className="material-icons">chevron_left</i></a>
          </li>
          {navIndicators}
          <li className={`${selectedPage + 1 > pages ? 'disabled' : 'waves-effect'}`}>
            <a href="#!"><i className="material-icons">chevron_right</i></a>
          </li>
        </ul>}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  pages: PropTypes.number,
  selectedPage: PropTypes.number,
  navIndicators: PropTypes.array
};

export default Pagination;
