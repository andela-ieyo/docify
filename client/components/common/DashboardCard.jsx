import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

/**
 * DashboardCard
 * @desc Page DashboardCard
 * @param {object} props default properties
 * @returns {jsx} the page DashboardCard
 */
const DashboardCard = ({ title, link, details, icon }) =>

    (<div className="container">
      <Link
        name="card"
        className="card white"
        to={link}
      >
        <div className="container col s6 m4 row">
          <div>
            <div className="card horizontal">
              <div className="card-stacked center-align">
                <div className="card-content">
                  <i className={`fa fa-${icon}`} />
                </div>
                {details}
                <div className="card-action dashboard-title">
                  <span className="card-title">{title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>);


DashboardCard.propTypes = {
  title: PropTypes.string,
  details: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.string
};

export default DashboardCard;
