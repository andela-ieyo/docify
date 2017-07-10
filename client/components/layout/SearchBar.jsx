import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ query, handleSearchInput }) => {
  return (
    <div className="docify-search">
      <form>
        <div>
          <div className="input-field">
            <input
              placeholder="Search"
              id="search"
              value={query}
              onChange={handleSearchInput}
              type="text"
              className="validate col s8"
            />
            <i className="material-icons col s4 search-icon">search</i>
          </div>
        </div>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  query: PropTypes.string,
  handleSearchInput: PropTypes.func.isRequired
};

export default SearchBar;
