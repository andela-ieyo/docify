import React, { Component } from 'react';
import PropTypes from 'prop-types';


class FlashMessage extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.deleteFlashMessage(this.props.message.id);
  }

  render() {
    const { id, text } = this.props.message;
    return (
      <div>
        <button onClick={this.onClick} className="close">
          <span>&times;</span>
        </button>
        {text}
      </div>
    );
  }
}

FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

export default FlashMessage;
