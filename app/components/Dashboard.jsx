import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { retrieveMyDocuments, retrieveAllDocuments } from '../actions/documentActions';


const updateFilters = (value) => (state) => {
  const itemExist = state.filters.includes(value);
  if (!itemExist) {
    return { filters: [...state.filters, value] };
  }
  return { filters: state.filters.filter(i => i !== value) };
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents || {},
      view:'allDocuments',
      filters: []
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  componentDidMount() {
    const userId = this.props.user.id;
    this.props.retrieveMyDocuments(userId);
    this.props.retrieveAllDocuments();
    $('.button-collapse').sideNav();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents) {
      this.setState({
        documents: nextProps.documents
      });
    }
  }

  handleOptionChange(event) {
    const { value } = event.target;
    this.setState({ view: value });
  }

  handleCheckBoxChange(event) {
    const { value } = event.target;
    this.setState(updateFilters(value));
  }

  render() {
    const role = this.props.user.roleId === 1 ? 'writer' : 'editor';
    const { filters } = this.state;
    const { documents } = this.props;
    const filteredDocs = (documents[this.state.view] || []).filter(
      doc => filters.includes(doc.access) || filters.length === 0
    );
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
          <li><a href="/alldocuments">
            <i className="material-icons">visibility</i>
             View All Documents
          </a></li>
          <li><a href="#!">Update profile</a></li>
          <li><div className="divider" /></li>
          <li><a className="subheader">Subheader</a></li>
          <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
        </ul>
        <a data-activates="slide-out" className="button-collapse">
          <i className="Small material-icons docify-menu">menu</i>
        </a>

        <div className="right-align docify-add">
          <button
            className="btn-floating btn-medium waves-effect waves-light red"
            onClick={() => browserHistory.push('/createdocument')}
          >
            <i className="material-icons">add</i></button>
        </div>

        <div className="row docify-search">
          <form>
            <div className="row">
              <div className="input-field">
                <input
                  placeholder="Search for a document"
                  id="search"
                  type="text"
                  className="validate col s8"
                />
                <a
                  role="button"
                  className="btn-floating"
                ><i className="material-icons col s4">search</i></a>
              </div>
            </div>
          </form>
        </div>
        {/* CheckBoxes */}
        <div className="row docify-checkbox">
          <form className="col s6">
            <div className="row">
              <p>
                <input
                  type="checkbox"
                  id="private"
                  className="filled-in col s2"
                  value="private"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="private">Private</label>

                <input
                  type="checkbox"
                  id="public"
                  value="public"
                  className="filled-in col s2"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="public">Public</label>

                <input
                  type="checkbox"
                  id="role"
                  value={role}
                  className="filled-in col s2"
                  onClick={this.handleCheckBoxChange}
                />
                <label htmlFor="role">Role</label>
              </p>
            </div>
          </form>

          <div className="col s4">
            <div className="input-field">
              <select
                className="browser-default"
                onChange={this.handleOptionChange}
                id="docify-option"
                value={this.state.view}
              >
                <option value="">Sort Options</option>
                <option value="myDocuments">Owned by Me</option>
                <option value="allDocuments">Shared with Me</option>
              </select>
            </div>
          </div>
        </div>


        <div className="row container-fluid doc-card" >
          {(filteredDocs || []).map(doc =>

            (<div className="col s6 m4" key={doc.id}>
              <div className="card docify-card">
                <div className="card-content">
                  <span className="card-title">{doc.title}</span>
                  <p className="docify-p">{doc.content.slice(0, 300)}...</p>
                </div>
                <div className="card-action">
                  <span>{doc.createdAt.slice(0, 10)}</span>
                  <div className="docify-icons">
                    <a
                      role="button"
                      className="btn-small waves-effect waves-light"
                    ><i className="small material-icons">pageview</i></a>
                    <a
                      role="button"
                      className="btn-small waves-effect waves-light"
                    ><i className="small material-icons">mode_edit</i></a>
                    <a
                      role="button"
                      className="btn-small waves-effect waves-light"
                    ><i className="small material-icons">delete</i></a>
                  </div>
                </div>
              </div>
            </div>)
            )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  retrieveMyDocuments: PropTypes.func.isRequired,
  retrieveAllDocuments: PropTypes.func.isRequired,
  documents: PropTypes.object
};

Dashboard.defaultProps = {
  documents: {}
};

const mapStateToProps = ({ user, documents }) => ({ user, documents });

export default connect(mapStateToProps, { retrieveMyDocuments, retrieveAllDocuments })(Dashboard);
