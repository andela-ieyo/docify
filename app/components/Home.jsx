import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="home-body">
      <div
        className="row app-name center-align"
        id="app-name"
      >
          Docify
        </div>

      <div className="row docify-home">
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

      <div className="row desc-section">
        <div className="desc-left">
          <div>
            <span>Manage your documents</span>
          </div>
          <p>Documents are managed by role assignments and ownership.</p>
        </div>

        <div className="desc-middle">
          <div>
            <span>Create and share documents</span>
          </div>
          <p>Share documents with other users on the same access level with you,
              or set them as public.</p>
        </div>

        <div className="desc-right">
          <div className="right-icon">
            <span>Sign Up, It's Free</span>
          </div>
          <p>Sign up for a free account,
                 Create your own group or Join one.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
