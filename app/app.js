import React, { PropTypes, Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <p> Header here ... </p>
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

export default App;
