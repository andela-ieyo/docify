import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { retrieveMyDocuments } from '../actions/documentActions';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents || []
    };
  }

  componentDidMount() {
    const userId = this.props.user.id;
    this.props.retrieveMyDocuments(userId);
    $('.button-collapse').sideNav();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents) {
      this.setState({
        documents: nextProps.documents
      });
    }
  }

  render() {
    return (
      <div>
        <ul id="slide-out" className="side-nav">
          <li>
            <div className="userView">
              <a href="#!name"><span className="name">Welcome</span></a>
              <a href="#!email">
                <span className="email">{this.props.user.email}</span>
              </a>
            </div>
          </li>
          <li><a href="#!"><i className="material-icons">visibility</i>View All Documents</a></li>
          <li><a href="#!">Update profile</a></li>
          <li><div className="divider" /></li>
          <li><a className="subheader">Subheader</a></li>
          <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
        </ul>
        <a href="#" data-activates="slide-out" className="button-collapse">
          <i className="material-icons">menu</i>
        </a>

        <div className="row container-fluid doc-card" >
          {(this.props.documents || []).map(doc => {
            return (

              <div className="col s6 m4" key={doc.id}>
                <div className="card docify-card">
                  <div className="card-content">
                    <span className="card-title">{doc.title}</span>
                    <p className="docify-p">{doc.content}</p>
                  </div>
                  <div className="card-action">
                    <span>{doc.createdAt.slice(0, 10)}</span>
                    <div className="docify-icons">
                      <i className="small material-icons">pageview</i>
                      <i className="small material-icons">mode_edit</i>
                      <i className="small material-icons">delete</i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  retrieveMyDocuments: PropTypes.func.isRequired,
  documents: PropTypes.array
};

Dashboard.defaultProps = {
  documents: []
};

const mapStateToProps = ({ user, documents }) => ({ user, documents });

export default connect(mapStateToProps, { retrieveMyDocuments })(Dashboard);
