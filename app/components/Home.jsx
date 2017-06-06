import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  render() {
    return (
      <div className="docify-home">
        <div className="docify-signup center-align">
          <div>
            <Link
              to="/signup"
              className="waves-effect waves-light btn"
            >
              SignUp
              <i className="material-icons right">send</i>
            </Link>
          </div>
        </div>
        <div className="docify-login center-align">
          <div>
            <Link
              to="/login"
              className="waves-effect waves-light btn"
            >
               Login
              <i className="material-icons right">send</i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
