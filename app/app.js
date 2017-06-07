import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import logOut from './actions/logOutAction';

class App extends Component {
  constructor() {
    super();
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler(event) {
    event.preventDefault();
    this.props.logOut(this.state);

  }
  render() {
    return (
      <div className="container-fluid">
        <nav>
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">Docify</a>
            <ul id="nav-mobile" className="right">
              <li><a role="button" onClick={this.onClickHandler}>Logout</a></li>
            </ul>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

App.defaultProps = {
  children: [] || null
};

export default connect(null, { logOut })(App);
